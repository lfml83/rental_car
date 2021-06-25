import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "rentx_test"
          : defaultOptions.database,
    })
  );
};

// modo antigo utilizando 2 container para realizer teste no localhos e o resto no database do docker
// export default async (host = "database"): Promise<Connection> => {
//   const defaultOptions = await getConnectionOptions();

//   return createConnection(
//     Object.assign(defaultOptions, {
//       host: process.env.NODE_ENV === "test" ? "localhost" : host,
//       database:
//         process.env.NODE_ENV === "test"
//           ? "rentx_test"
//           : defaultOptions.database,
//     })
//   );
// };
