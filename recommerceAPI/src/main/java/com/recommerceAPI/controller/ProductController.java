package com.recommerceAPI.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.dto.PageResponsePpDTO;
import com.recommerceAPI.dto.ProductDTO;
import com.recommerceAPI.service.ProductService;
import com.recommerceAPI.util.CustomFileUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@Log4j2

public class ProductController {

    private final ProductService productService;
    private final CustomFileUtil fileUtil;

    @GetMapping("/")
       public PageResponsePpDTO<ProductDTO> list(PageRequestDTO pageRequestDTO, String pname, String pcategory){

           log.info("list----------------------"+ pageRequestDTO);

           return productService.getList(pageRequestDTO, pname, pcategory);
       }


    // 특정 상품 번호(pno)에 대한 상세 정보를 조회하는 API
    @GetMapping(value ="/product/read/{pno}")
    public ProductDTO getProduct(@PathVariable(name="pno") Long pno) {
        log.info("getProduct: " + pno);

        // 상품 서비스를 통해 상품 정보 조회
        ProductDTO productDTO = productService.get(pno);

        // 조회된 상품 정보를 ResponseEntity에 담아 반환
        // 상품 정보가 존재하지 않을 경우 NOT_FOUND 상태 코드를 반환할 수 있도록 처리
        return productDTO;
    }


    @GetMapping("/product/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){

        return fileUtil.getFile(fileName);

    }


    @PostMapping("/product/register")
    public Map<String, Long> register(ProductDTO productDTO){

        log.info("!!!!!!!!!!!!!!!!!!!!Received productDTO: " + productDTO); // productDTO 확인 로그 추가

        List<MultipartFile> files = productDTO.getFiles();

        List<String> uploadFileNames = fileUtil.saveFiles(files);

        productDTO.setUploadFileNames(uploadFileNames);

        log.info("!!!!!!!!!!!!!!!!!!!!!!!!!Uploaded file names: " + uploadFileNames); // 업로드된 파일 이름 확인 로그 추가

        //서비스 호출
        Long pno = productService.register(productDTO);

        try{  // front의 fetching 진행모달창 1초동안 보이기
            Thread.sleep(1000);
        }catch(InterruptedException e){
            e.printStackTrace();
        }

        return Map.of("result", pno);
    }


    @PutMapping("product/modify/{pno}")
    public Map<String, String> modify(@PathVariable(name="pno")Long pno, ProductDTO productDTO) {

        productDTO.setPno(pno);

        ProductDTO oldProductDTO = productService.get(pno);

        //기존의 파일들 (데이터베이스에 존재하는 파일들 - 수정 과정에서 삭제되었을 수 있음)
        List<String> oldFileNames = oldProductDTO.getUploadFileNames();

        //새로 업로드 해야 하는 파일들
        List<MultipartFile> files = productDTO.getFiles();

        //새로 업로드되어서 만들어진 파일 이름들
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);

        //화면에서 변화 없이 계속 유지된 파일들
        List<String> uploadedFileNames = productDTO.getUploadFileNames();

        //유지되는 파일들  + 새로 업로드된 파일 이름들이 저장해야 하는 파일 목록이 됨
        if(currentUploadFileNames != null && currentUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(currentUploadFileNames);
        }

        //수정 작업
        productService.modify(productDTO);

        if(oldFileNames != null && oldFileNames.size() > 0){

            //지워야 하는 파일 목록 찾기
            //예전 파일들 중에서 지워져야 하는 파일이름들
            List<String> removeFiles = oldFileNames.stream()
                    .filter(fileName -> !uploadedFileNames.contains(fileName))
                    .collect(Collectors.toList());

            //실제 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }

        return Map.of("RESULT", "SUCCESS");
    }


    @DeleteMapping("product/delete/{pno}")
    public Map<String, String> remove(@PathVariable("pno") Long pno) {
        //삭제해야할 파일들 알아내기
        List<String> oldFileNames =  productService.get(pno).getUploadFileNames();
        productService.remove(pno);
        fileUtil.deleteFiles(oldFileNames);
        return Map.of("RESULT", "SUCCESS");
    }
}