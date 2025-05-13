package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product,Long> {
    Page<Product> findByCategoryAndIsDeletedFalse(String category, Pageable pageable);
    Page<Product> findByIsDeletedFalse(Pageable pageable);
    List<Product> findByIsDeletedFalse();
}
