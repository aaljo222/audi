package com.green.project.Leo.dto.admin.payment;

import com.green.project.Leo.entity.payment.RefundStatus;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@ToString

public class ProductRefundDetailDTO {
 private Long refundId;
 private String reason;
 private RefundStatus status;
 private String pname;
 private String price;
 private String productImgFileName;
 private LocalDateTime orderDate;
 private int numOfItem;
 private String userId;
 private String userName;
 private String userPhoneNum;
 private String userAddress;
 private String imp_uid;



 public ProductRefundDetailDTO(Long refundId, String reason, RefundStatus status,
                               String pname, String price,
                               LocalDateTime orderDate, int numOfItem,
                               String userId, String userName, String userPhoneNum,
                               String userAddress,String imp_uid) {
  this.refundId = refundId;
  this.reason = reason;
  this.status = status;
  this.pname = pname;
  this.price = price;
  this.orderDate = orderDate;
  this.numOfItem = numOfItem;
  this.userId = userId;
  this.userName = userName;
  this.userPhoneNum = userPhoneNum;
  this.userAddress = userAddress;
  this.imp_uid = imp_uid;

 }
}
