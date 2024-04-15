package com.recommerceAPI.controller;

import java.security.Principal;
import java.util.List;


import com.recommerceAPI.dto.WishlistItemDTO;
import com.recommerceAPI.dto.WishlistItemListDTO;
import com.recommerceAPI.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    // 카트 아이템 수량 변경 요청을 처리하는 메서드
//    @PreAuthorize("#itemDTO.email == authentication.name")
    @PostMapping("/change")
    public List<WishlistItemListDTO> changeCart(@RequestBody WishlistItemDTO itemDTO){
        log.info(itemDTO);
        if(itemDTO.getQty() <= 0) {
            return wishlistService.remove(itemDTO.getWino());
        }
        return wishlistService.addOrModify(itemDTO);
    }

    // 로그인한 사용자의 카트 아이템 목록 조회 요청을 처리하는 메서드
    @GetMapping("/items")
    public List<WishlistItemListDTO> getCartItems(Principal principal){
        String email = principal.getName();
        log.info("-------------------------");
        log.info("email: "+ email);
        return wishlistService.getWishlistItems(email);
    }
    // 카트 아이템 삭제 요청을 처리하는 메서드
    @DeleteMapping("/{wino}")
    public List<WishlistItemListDTO> removeFromCart(@PathVariable("cino") Long wino){
        log.info("wishlist item no: "+ wino);
        return wishlistService.remove(wino);
    }

}
