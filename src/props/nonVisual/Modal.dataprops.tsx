import { ModalProps } from "react-bootstrap";
interface ModalDataProps extends ModalProps
{
    confirm_handler?:(value?:object)=>any;
    cancel_handler?:(value?:object)=>any;
    type:"Create"|"Update"
}

export {ModalDataProps}