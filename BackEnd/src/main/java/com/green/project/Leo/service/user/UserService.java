package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.product.ProductCartDTO;
import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;
import com.green.project.Leo.entity.user.User;
import com.siot.IamportRestClient.exception.IamportResponseException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface UserService {
    String addCart(RequestCartDTO cartDTO);
    List<ProductCartDTO> selectCartList(String userId);
    String addOrder(String imp_uid, ProductOrderDTO orderDTO) throws IamportResponseException, IOException;
    void deleteFromCart(Long cartNo);
    void addConcertOrder(String uid) throws IamportResponseException, IOException;
    User findByUserId(String userId);
    void savePasswordResetToken(User user, String token);
    void sendResetEmail(String toEmail, String resetLink);
    void save(User user);
    void testRefund(String imp_uid) throws IamportResponseException, IOException;

}
