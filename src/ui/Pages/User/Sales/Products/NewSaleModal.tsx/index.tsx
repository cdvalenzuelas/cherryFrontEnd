// Libs
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import {
  useState,
  type Dispatch,
  type FC,
  type MouseEvent,
  type SetStateAction,
  type ChangeEvent,
  useEffect,
} from "react";
import style from "./styles.module.css";

import { SearchProducts } from "@/ui/Global/SearchProducts";
import {
  createProductSale,
  updateInvoices,
  updateProducts,
  createSalary,
} from "@/api";
import { useInvoicesState, useProductsState, useSalaryState } from "@/state";

interface Props {
  isOpen: boolean;
  handleOpen: (e: MouseEvent<HTMLButtonElement>) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface Summary {
  product_id: string;
  invoice: string;
  quantity: number;
  quantityFromDb: number;
  price: number;
  total: number;
  profit: number;
  discount?: number;
}

interface InvoicesToUpdate {
  id: string;
  total: number;
}

export const NewSaleModal: FC<Props> = ({ isOpen, handleOpen, setIsOpen }) => {
  const invoices = useInvoicesState((state) => state.invoices);
  const salaries = useSalaryState((state) => state.salaries);
  const addSalary = useSalaryState((state) => state.addSalary);
  const updateTotalRecovery = useInvoicesState(
    (state) => state.updateTotalRecovery,
  );
  const updateProductsQuantity = useProductsState(
    (state) => state.updateProductsQuantity,
  );

  const [summary, setSummary] = useState<Summary[]>([]);
  const [date, setDate] = useState<string>(() => {
    const newDate = new Date();
    const month =
      newDate.getMonth() + 1 < 10
        ? `0${newDate.getMonth() + 1}`
        : `${newDate.getMonth() + 1}`;
    const day =
      newDate.getDate() < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`;

    return `${newDate.getFullYear()}-${month}-${day}`;
  });

  const getSummary = (summary: Summary[]) => {
    setSummary(summary);
  };

  // Manejar el agregar y eliminar usuarios
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productsToUpdate = summary.map((item) => {
      return {
        id: item.product_id,
        quantity: item.quantityFromDb - item.quantity,
      };
    });

    const invoicesToUpdate: InvoicesToUpdate[] = [];

    summary.forEach((element) => {
      const InternalInvoicesToUpdate = invoicesToUpdate.map(
        (item) => item.invoice,
      );

      const invoice = invoices.find((item) => item.name === element.invoice);

      if (InternalInvoicesToUpdate.includes(element.invoice)) {
        const index = invoicesToUpdateIds.indexOf(element.invoice);
        invoicesToUpdate[index].total += element.total;
      } else {
        invoicesToUpdate.push({
          id: element.invoice,
          total: invoice.recovered_money + element.total,
        });
      }
    });

    const salaryIsOk = salaries.some((item) => item.date === date);

    if (!salaryIsOk) {
      const newSalary = {
        date,
        amount: 50000,
      };

      const createdSalary = await createSalary(newSalary);
      addSalary(createdSalary);
    }

    const productSale = await createProductSale(summary, date);
    const updatedInvoices = await updateInvoices(invoicesToUpdate);
    const updatedProducts = await updateProducts(productsToUpdate);

    updateTotalRecovery(invoicesToUpdate);
    updateProductsQuantity(productsToUpdate);
    setIsOpen(false);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
  };

  return (
    <Modal
      placement="center"
      isOpen={isOpen}
      size="lg"
      backdrop="blur"
      className={style.form}
    >
      <ModalContent>
        <ModalHeader>Registrar Nueva Venta de Productos</ModalHeader>

        <ModalBody>
          <Input type="date" value={date} onChange={handleDateChange} />
          <SearchProducts getSummary={getSummary} />
        </ModalBody>

        <ModalFooter>
          <Button
            name="close"
            size="sm"
            color="danger"
            variant="ghost"
            onClick={handleOpen}
          >
            Cerrar
          </Button>
          <Button size="sm" color="primary" onClick={handleSubmit}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
