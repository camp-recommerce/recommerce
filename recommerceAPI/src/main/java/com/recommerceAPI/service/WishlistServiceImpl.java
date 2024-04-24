package com.recommerceAPI.service;


import com.recommerceAPI.domain.Product;
import com.recommerceAPI.domain.User;
import com.recommerceAPI.domain.Wishlist;
import com.recommerceAPI.domain.WishlistItem;
import com.recommerceAPI.dto.WishlistItemDTO;
import com.recommerceAPI.dto.WishlistItemListDTO;
import com.recommerceAPI.repository.WishlistItemRepository;
import com.recommerceAPI.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Log4j2
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    private final WishlistItemRepository wishlistItemRepository;

    @Override
    public List<WishlistItemListDTO> addOrModify(WishlistItemDTO wishlistItemDTO) {

        String email = wishlistItemDTO.getEmail();

        Long pno = wishlistItemDTO.getPno();

        int qty = wishlistItemDTO.getQty();

        Long wino = wishlistItemDTO.getWino();

        log.info("======================================================");
        log.info(wishlistItemDTO.getWino() == null);

        if(wino != null) { //장바구니 아이템 번호가 있어서 수량만 변경하는 경우

            Optional<WishlistItem> wishlistItemResult = wishlistItemRepository.findById(wino);

            WishlistItem wishlistItem = wishlistItemResult.orElseThrow();

            wishlistItem.changeQty(qty);

            wishlistItemRepository.save(wishlistItem);

            return getWishlistItems(email);
        }

        //장바구니 아이템 번호 cino가 없는 경우

        //사용자의 카트
        Wishlist wishlist = getWishlist(email);
        log.info(wishlist);

        WishlistItem wishlistItem = null;

        //이미 동일한 상품이 담긴적이 있을 수 있으므로
        wishlistItem = wishlistItemRepository.getItemOfPno(email, pno);
        log.info(wishlistItem);
        if(wishlistItem == null){
            Product product = Product.builder().pno(pno).build();
            wishlistItem = WishlistItem.builder().product(product).wishlist(wishlist).qty(qty).build();

        }else {
            wishlistItem.changeQty(qty);
        }

        //상품 아이템 저장
        wishlistItemRepository.save(wishlistItem);

        return getWishlistItems(email);
    }


    //사용자의 장바구니가 없었다면 새로운 장바구니를 생성하고 반환
    private Wishlist getWishlist(String email ){

        Wishlist wishlist = null;

        Optional<Wishlist> result = wishlistRepository.getWishlistOfMember(email);

        if(result.isEmpty()) {

            log.info("member is not exist!!");

            User user = User.builder().email(email).build();

            Wishlist tempWishlist = Wishlist.builder().owner(user).build();

            wishlist = wishlistRepository.save(tempWishlist);

        }else {
            wishlist = result.get();
        }
        return wishlist;
    }

    @Override
    public List<WishlistItemListDTO> getWishlistItems(String email){

        return wishlistItemRepository.getItemsOfWishlistDTOByEmail(email);

    }

    @Override
    public List<WishlistItemListDTO> remove(Long wino) {

        Long wno  = wishlistItemRepository.getWishlistFromItem(wino);

        log.info("wishlist no: " + wno);

        wishlistItemRepository.deleteById(wino);

        return wishlistItemRepository.getItemsOfWishlistDTOByWishlist(wno);

    }

}