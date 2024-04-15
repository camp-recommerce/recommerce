package com.recommerceAPI.service;



import com.recommerceAPI.dto.WishlistItemDTO;
import com.recommerceAPI.dto.WishlistItemListDTO;
import jakarta.transaction.Transactional;

import java.util.List;

@Transactional
public interface WishlistService {

    //장바구니 아이템 추가 혹은 변경
    public List<WishlistItemListDTO> addOrModify(WishlistItemDTO wishlistItemDTO);

    //모든 장바구니 아이템 목록
    public List<WishlistItemListDTO> getWishlistItems(String email);

    //아이템 삭제
    public List<WishlistItemListDTO> remove(Long wino);



}