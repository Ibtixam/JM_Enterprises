import { useState } from "react";
import {
  ModalContainer,
  Title,
  Input,
  Label,
  InputWrapper,
  Overlay,
  ButtonWrapper,
  CancelButton,
  SaveButton,
} from "./styles";
import ReactDOM from "react-dom";
import React from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { swalAlert } from "../../utils/helpers";
import { useApp } from "../../contexts";

interface ModalProps {
  visible?: boolean;
  setProducts?: React.Dispatch<React.SetStateAction<any | undefined>>;
  props?: any;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalInputProps {
  Cash_payment_voucher: string;
  GTN_Number: string;
  Salary_payment_voucher: string;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  setProducts,
}) => {
  const { storedToken } = useApp() || {};
  const [modalInputData, setModalInputData] = useState<ModalInputProps>({
    Cash_payment_voucher: "",
    GTN_Number: "",
    Salary_payment_voucher: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setModalInputData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const API_URL = `${BASE_URL}/api/add/products`;
    try {
      const response = await axios.post(API_URL, modalInputData, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": storedToken,
        },
      });
      if (setProducts) {
        setProducts((prev: any) => [...prev, { ...modalInputData }]);
      }
      setModalInputData({
        Cash_payment_voucher: "",
        Salary_payment_voucher: "",
        GTN_Number: "",
      });
      swalAlert("Product Successfully Added");
      onCancel?.();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {visible && (
        <>
          <Overlay onClick={onCancel} />
          <ModalContainer>
            <Title>Add Product</Title>
            <InputWrapper>
              <Label>Cash Payment Voucher: </Label>
              <Input
                name="Cash_payment_voucher"
                value={modalInputData.Cash_payment_voucher}
                onChange={handleOnChange}
              />
            </InputWrapper>
            <InputWrapper>
              <Label>Salary Payment Voucher: </Label>
              <Input
                name="Salary_payment_voucher"
                value={modalInputData.Salary_payment_voucher}
                onChange={handleOnChange}
              />
            </InputWrapper>
            <InputWrapper>
              <Label>GTN Number: </Label>
              <Input
                name="GTN_Number"
                value={modalInputData.GTN_Number}
                onChange={handleOnChange}
              />
            </InputWrapper>
            <ButtonWrapper>
              <CancelButton onClick={onCancel}>Cancel</CancelButton>
              <SaveButton onClick={onConfirm || handleSave}>Save</SaveButton>
            </ButtonWrapper>
          </ModalContainer>
        </>
      )}
    </>
  );
};

const createModal: React.FC<ModalProps> = (props) => {
  const createModal: any = document.getElementById("modal");
  return ReactDOM.createPortal(<Modal {...props} />, createModal);
};

export default createModal;
