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

        await axios.get(listUrl+'/'+code)
        .then(res => {
            console.log(res)
            product = res.data
        })
        .catch(err => {throw err});

        products.push(product);
    }
    return products;
}

const CSVReader = () => {
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState<ValidationError | undefined>(undefined);

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
        
        console.log({ res: JSON.parse(res.data) });
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
      let isError = false;
      await axios.post(
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
          setError(undefined);
        }
      })
      .catch((err: any) => {
        console.log({err});
        if (!err.response) {
          setError(new ValidationError('Erro de Conexão', -1, -1));
          setValid(false);
          return;
        }
        setError(err.response.data.err);
        setValid(false);
        isError = true;
      });
      
      if (isError) return;

      let productsBeingUpdated: Product[] | any = [];
      const codes: number[] = rows.splice(0, rows.length-1).map((row:  any) => {
        return Number(row[0]);
      });
      console.log({ codes});

      try {
        productsBeingUpdated = await getProductsBeingUpdated(codes);
      } catch (err) {
        setError(new ValidationError('Erro de Conexão', -1, -1));
        setValid(false);
        return;
      }
      console.log({ productsBeingUpdated});
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
              <th className={ error !== undefined && error.line === 0 && error.column === i ? 'header-error' : '' } key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((rowData, i) => {
            return (
              <tr className={ error !== undefined && error.line === i + 1 && error.column === -1 ? 'row-error' : '' } key={i}>
                {rowData?.map((data, j) => {
                  return <td className={ error !== undefined && error.line === i + 1 && error.column === j ? 'cell-error' : '' } key={j}>{data}</td>;
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

        { valid && <input type="submit" onClick={handleSubmitFile} onChange={() => {}} value="Atualizar"/> }
        <div className="error-box">
          { error !== undefined && <>
            <p>{ 'Error: '+error.info }</p>
            <p>{ `Linha: ${error.line}` }</p>
            <p>{ `Column: ${error.column}` }</p>
            </> }
        </div>
    </div>
  );
};

export default CSVReader;
