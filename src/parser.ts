import { parse } from 'csv-parse';
import { ProductUpdate } from './types/productUpdate';

const columnTypes: ('number' | 'array')[] = ['number', 'number'];

const parseCsv: ((csv: string) => ProductUpdate[]) = (csv: string) => {
      
  const parser = parse({
    bom: true,
    delimiter: ',',
    columns: true,
    comment: '#',
    comment_no_infix: true,
    from: 1,
  });

  const records: ProductUpdate[] = [];

  parser.on('readable', function(){
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  parser.on('error', function(err){
    throw new Error(err.message);
  });

  parser.on('end', function(){
    console.log({ records });
  });

  parser.write(csv);
  parser.end();

  return records;
}

export {
  parseCsv,
};
