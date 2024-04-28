package com.recommerceAPI.repository;

import java.util.List;


import com.recommerceAPI.domain.WishlistItem;
import com.recommerceAPI.dto.WishlistItemDTO;
import com.recommerceAPI.dto.WishlistItemListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long>{

    // 회원의 이메일을 기반으로 해당 회원의 카트 아이템 목록을 조회하는 쿼리 메서드
    @Query("select new com.recommerceAPI.dto.WishlistItemListDTO(" +
            "wi.wino, " +
            "wi.qty, " +
            "p.pno, " +
            "p.pname, " +
            "p.price, " +
            "pi.fileName, " +
            "p.soldOut, " +
            "p.userEmail) " +
            "from WishlistItem wi " +
            "inner join Wishlist mc on wi.wishlist = mc " +
            "left join Product p on wi.product = p " +
            "left join p.imageList pi " +
            "where mc.owner.email = :email and pi.ord = 0 " +
            "order by wi desc")
    public List<WishlistItemListDTO> getItemsOfWishlistDTOByEmail(@Param("email") String email);


    // 회원의 이메일과 상품 번호를 기반으로 해당 회원의 해당 상품의 카트 아이템을 조회하는 쿼리 메서드
    @Query("select" +
            " wi "+
            " from " +
            "   WishlistItem wi inner join Wishlist w on wi.wishlist = w " +
            " where " +
            "   w.owner.email = :email and wi.product.pno = :pno")
    public WishlistItem getItemOfPno(@Param("email") String email, @Param("pno") Long pno );

    // 카트 아이템 번호를 기반으로 해당 카트 아이템의 카트 번호를 조회하는 쿼리 메서드
    @Query("select " +
            "  w.wno " +
            "from " +
            "  Wishlist w inner join WishlistItem wi on wi.wishlist = w " +
            " where " +
            "  wi.wino = :wino")
    public Long getWishlistFromItem( @Param("wino") Long wino);

    // 카트 번호를 기반으로 해당 카트의 카트 아이템 목록을 조회하는 쿼리 메서드
    @Query("select new com.recommerceAPI.dto.WishlistItemListDTO(wi.wino,  wi.qty,  p.pno, p.pname, p.price , pi.fileName, p.soldOut, p.userEmail )  " +
            " from " +
            "   WishlistItem wi inner join Wishlist mc on wi.wishlist = mc " +
            "   left join Product p on wi.product = p " +
            "   left join p.imageList pi" +
            " where " +
            "  mc.wno = :wno and pi.ord = 0 " +
            " order by wi desc ")

    public List<WishlistItemListDTO> getItemsOfWishlistDTOByWishlist(@Param("wno") Long wno);


}
