import React from "react";
import { ProductImages } from "./ProductImages";
import { ProductInfo } from "./ProductInfo";

const QuickProductView = ({ showModal, onClose, product }) => {
  return (
    <div
      className={`modal fade ${showModal ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content" style={{ width: "90vw" }}>
          <div className="modal-header">
            <h5 className="modal-title">{product.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
                <div className="col-6 text-center">
                    <ProductImages images={product.images}  title={product.title} thumbSize={{width:100, height:100}} />
                </div>
                <div className="col-6 product-details">
                   <ProductInfo product={product} showTitle="no" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickProductView;
