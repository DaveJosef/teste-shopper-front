import React, { useState } from "react";
import CSVSelector from "./CSVSelector";
import axios from "axios";
import { Product } from "./types/product";
import { ValidationError } from "./exceptions/validationError";

const listUrl = 'http://localhost:5000/products';
const submitUrl = 'http://localhost:5000/file/submit';
const validateUrl = 'http://localhost:5000/file/validate';

const getProductsBeingUpdated = async (codes: number[]) => {
    const products: Product[] = [];
    for (const code of codes) {
        let product: Product | any = {};

        await axios.get(listUrl, { params: { code: code + '' } })
        .then(res => {
            console.log(res)
            product = res.data
        })
        .catch(err => console.log(err));

        products.push(product);
    }
    return products;
}

const CSVReader = () => {
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState<ValidationError | any>({});

  const [ valid, setValid ] = useState<boolean>(false);
  //const [ csvPreview, setCsvPreview ] = useState<string>('');
  const [ csv, setCsv ] = useState<File | null>(null);

  const headers = data[0];
  const rows = data.slice(1);

  const handleCsvPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = e.target.files![0];

    console.log({ file });
    //setCsvPreview(URL.createObjectURL(file));
    setValid(false);
    handleValidate();
    //setCsv(file);

  }

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

  const handleValidate = async () => {
    if (csv !== null) {
      let formData = new FormData();
      formData.append('file', csv);

      console.log({ csv });
      let productsBeingUpdated: Product[] | any = [];
      const codes: number[] = rows.map((row:  any) => {
        return Number(row[0]);
      });

      productsBeingUpdated = await getProductsBeingUpdated(codes);
      console.log({ productsBeingUpdated})
/* 
      axios.get(
        listUrl,
        {
            params: {
                codes: codes.join(','),
            }
        }
      ).then((res) => {
        productsBeingUpdated = res;
        console.log({ codes: codes.join(',') });
        console.log({ productsBeingUpdated})
      }).catch((err) => {
        console.log({err});
      });
 */
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
        console.log({err});
        setError(err.response.data.err);
        setValid(false);
      });
    }
  }

  return (
    <div>
      <CSVSelector onChange={({ data, raw, file }) => {
        //setCsvPreview(raw);
        setData(data);
        setCsv(file);
      }} />
      <table>
        <thead>
          <tr>
            {headers?.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((rowData, i) => {
            return (
              <tr key={i}>
                {rowData?.map((data, i) => {
                  return <td key={i}>{data}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <input
            type="button"
            onClick={handleValidate}
            name='validate-btn'
            value='validate'
        />
        <label htmlFor='validate-btn'>Validate file</label>

        {/* <input
            name='submit-btn'
            type="file"
            onChange={handleCsvPreview}
        />
        <label htmlFor='submit-btn'>Upload file</label> */}
        { valid && <input type="submit" onClick={handleSubmitFile} onChange={() => {}} value="Atualizar"/> }
        <p>{ 'Error: '+JSON.stringify(error) }</p>
        <p>{ `Linha: ${error.line}` }</p>
        <p>{ `Column: ${error.column}` }</p>
    </div>
  );
};

export default CSVReader;
