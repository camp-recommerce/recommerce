package com.recommerceAPI.controller;

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

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/auction")
public class AuctionController {

    private final AuctionService service;
    private final CustomFileUtil customFileUtil;

    @GetMapping("/{apno}")
    public AuctionDTO get(@PathVariable(name = "apno") Long apno) {

        return service.get(apno);
    }

    @GetMapping("/list")
    public PageResponseDTO<AuctionDTO> list(PageRequestDTO pageRequestDTO, String apName, String apCategory) {

        log.info(pageRequestDTO);

        PageResponseDTO responseDTO = service.list(pageRequestDTO,apName,apCategory);
        return responseDTO;
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){

        return customFileUtil.getFile(fileName);
    }

//    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/")
    public Map<String, Long> register(AuctionDTO auctionDTO) {
        log.info("AuctionDTO: " + auctionDTO);

        List<MultipartFile> files = auctionDTO.getFiles();

        List<String> uploadFileNames = customFileUtil.saveFiles(files);

        auctionDTO.setUploadFileNames(uploadFileNames);

        log.info(auctionDTO.getUploadFileNames());

        Long apno = service.register(auctionDTO);

        return Map.of("APNO", apno);
    }

//    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{apno}")
    public Map<String, String> modify(@PathVariable(name="apno") Long apno,
                                      AuctionDTO auctionDTO) {
        auctionDTO.setApno(apno);

        log.info("Modify: " + auctionDTO);

        service.modify(auctionDTO);

        return Map.of("RESULT", "SUCCESS");
    }

//    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{apno}")
    public Map<String, String> remove(@PathVariable(name="apno") Long apno) {
        log.info("Remove: " + apno);

        service.remove(apno);

        return Map.of("RESULT", "SUCCESS");
    }
}
