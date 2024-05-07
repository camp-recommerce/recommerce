package com.recommerceAPI.controller;

import com.recommerceAPI.domain.AuctionStatus;
import com.recommerceAPI.dto.AuctionDTO;
import com.recommerceAPI.dto.PageRequestDTO;
import com.recommerceAPI.dto.PageResponseDTO;
import com.recommerceAPI.service.AuctionService;
import com.recommerceAPI.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/auction")
public class AuctionController {

    private final AuctionService auctionService;
    private final CustomFileUtil fileUtil;

    @GetMapping("/read/{apno}")
    public AuctionDTO get(@PathVariable(name = "apno") Long apno) {

        AuctionDTO auctionDTO = auctionService.get(apno);

        return auctionDTO;
    }

    @GetMapping("/list")
    public PageResponseDTO<AuctionDTO> list(PageRequestDTO pageRequestDTO, String apName, String apCategory, String apStatus) {

        log.info(pageRequestDTO);

        AuctionStatus status = null;
        try {
            status = AuctionStatus.valueOf(apStatus);
        } catch (IllegalArgumentException e) {
        }

        return auctionService.getList(pageRequestDTO, apName, apCategory, status);
    }

    @GetMapping("/bidlist")
    public PageResponseDTO<AuctionDTO> bidList(PageRequestDTO pageRequestDTO, String apBuyer){
        return auctionService.findByApBuyer(pageRequestDTO,apBuyer);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){

        return fileUtil.getFile(fileName);
    }

//    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/post")
    public Map<String, Long> register(AuctionDTO auctionDTO) {
        log.info("AuctionDTO: " + auctionDTO);

        List<MultipartFile> files = auctionDTO.getFiles();

        List<String> uploadFileNames = fileUtil.saveFiles(files);

        auctionDTO.setUploadFileNames(uploadFileNames);

        log.info(auctionDTO.getUploadFileNames());

        Long apno = auctionService.register(auctionDTO);

        try {
            Thread.sleep(1000);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
        return Map.of("APNO", apno);
    }

    @PutMapping("/buy/{apno}")
    public Map<String,String> buy(@PathVariable(name = "apno")Long apno){

        auctionService.buy(apno);

        return Map.of("RESULT", "SUCCESS");
    }

//    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/modify/{apno}")
    public Map<String, String> modify(@PathVariable(name="apno") Long apno,
                                      AuctionDTO auctionDTO) {
        auctionDTO.setApno(apno);

        AuctionDTO oldAuctionDTO = auctionService.get(apno);

        // 기존의 파일들 (데이터베이스에 존재하는 파일들 - 수정 과정에서 삭제되었을 수 있음)
        List<String> oldFileNames = oldAuctionDTO.getUploadFileNames();

        //새로 업로드 해야 하는 파일들
        List<MultipartFile> files = auctionDTO.getFiles();

        // 새로 업로드 되어서 만들어진 파일 이름들
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);

        // 화면에서 변화 없이 계속 유지된 파일들
        List<String> uploadedFileNames = auctionDTO.getUploadFileNames();

        // 유지되는 파일들 + 새로 업로드 된 파일 이름들이 저장해야 하는 파일 목록이 됨
        if(currentUploadFileNames != null && currentUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(currentUploadFileNames);
        }

        log.info("Modify: " + auctionDTO);

        auctionService.modify(auctionDTO);

        if(oldFileNames != null && oldFileNames.size() > 0) {
            // 지워야 하는 파일 목록 찾기
            // 예전 파일들 중에서 지워져야 하는 파일 이름들
            List<String> removeFiles = oldFileNames.stream()
                    .filter(fileName -> !uploadedFileNames.contains(fileName))
                    .collect(Collectors.toList());

            // 실제 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }

        return Map.of("RESULT", "SUCCESS");
    }

//    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/delete/{apno}")
    public Map<String, String> remove(@PathVariable(name="apno") Long apno) {
        log.info("Remove: " + apno);
        List<String> oldFileNames = auctionService.get(apno).getUploadFileNames();
        auctionService.remove(apno);
        fileUtil.deleteFiles(oldFileNames);
        return Map.of("RESULT", "SUCCESS");
    }
}
