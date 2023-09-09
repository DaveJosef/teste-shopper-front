import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { ProductUpdate } from './types/productUpdate';
import { Product } from './types/product';
import CSVReader from './CSVReader';
/* 
const listUrl = 'http://localhost:5000/products';
const submitUrl = 'http://localhost:5000/file/submit';
const validateUrl = 'http://localhost:5000/file/validate'; */
/* 
interface TableProps {
  productsUpdate: ProductUpdate[]
}

function TableRow({ productUpdate }: { productUpdate: ProductUpdate }) {
  return (
    <tr>
      <td>{ productUpdate.product_code }</td>
      <td>{ productUpdate.new_price }</td>
    </tr>
  );
}

function Table({ productsUpdate }: TableProps) {
  return (
    <table>
      {
        productsUpdate.map((product) => {
          return (
            <TableRow productUpdate={product} />
          );
        })
      }
    </table>
  );
}
 */
function App() {
/* 
  const [ valid, setValid ] = useState<boolean>(false);
  const [ csvPreview, setCsvPreview ] = useState<string>('');
  const [ csv, setCsv ] = useState<File | null>(null);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = e.target.files![0];

    console.log({ file });
    setCsvPreview(URL.createObjectURL(file));
    setValid(false);
    handleValidate();
    setCsv(file);

  } */
/* 
  const handleSubmitFile = () => {
    if (csv !== null) {
      let formData = new FormData();
      formData.append('file', csv);

      axios.post(
        submitUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      ).then((res) => {
        console.log({ res });
      })
      .catch((err: any) => {
        console.log({err});
      });
    }
  }

  const handleValidate = () => {
    if (csv !== null) {
      let formData = new FormData();
      formData.append('file', csv);

      console.log({ csv });
      let productsBeingUpdated: Product[] | any = [];

      axios.get(
        listUrl,
      ).then((res) => {
        productsBeingUpdated = res;
      }).catch((err) => {
        console.log({err});
      });

      axios.post(
        validateUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      ).then((res) => {
        console.log({ res });

        if (res.status === 200) {
          setValid(true);
        }
      })
      .catch((err: any) => {
        setValid(false);
      });
    }
  }
 */
  return (
    <div className='container'>
      {/* 
        <textarea name="csv-preview" id="csv-preview" value={csvPreview}></textarea>

        <input
            type="button"
            onClick={handleValidate}
            name='validate-btn'
        />
        <label htmlFor='validate-btn'>Validate file</label>

        <input
            name='submit-btn'
            type="file"
            onChange={handleImagePreview}
        />
        <label htmlFor='submit-btn'>Upload file</label>
        { valid && <input type="submit" onClick={handleSubmitFile} onChange={() => {}} value="Atualizar"/> } */}
        <CSVReader />
    </div>
  );
}

export default App;
