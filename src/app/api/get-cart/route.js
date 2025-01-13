// api/get-cart/route.js

import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

export async function GET(req) {
  const TABLE_ACCOUNT_NAME = 'vipernest';
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY;
  const TABLE_NAME = 'azureAscendantsMeltyMagicCart';
  try {
    // Extract user identifier from query parameters
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user"); // Assuming 'user' is passed as a query parameter
    console.log(user);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User identifier is required" }),
        { status: 400 }
      );
    }

    const credential = new AzureNamedKeyCredential(
      TABLE_ACCOUNT_NAME,
      TABLE_ACCOUNT_KEY
    );
    const tableClient = new TableClient(
      `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
      TABLE_NAME,
      credential
    );

    const cart = [];

    // Fetch all cart items for the user
    for await (const entity of tableClient.listEntities({
      queryOptions: { filter: `PartitionKey eq '${user}'` },
    })) {
      cart.push({
        name: entity.rowKey,
        // name: entity.productName,
        price: entity.price,
        quantity: entity.quantity,
        imageUrl: entity.imageUrl
      });
    }
    console.log('cart');
    console.log(cart);
    return new Response(JSON.stringify({ cart }), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart data" }),
      { status: 500 }
    );
  }
}


// import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

// export async function GET(req) {
//   const TABLE_ACCOUNT_NAME = 'vipernest';
//   const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY;
//   const TABLE_NAME = 'azureAscendantsMeltyMagicCart';

//   try {
//     const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
//     const tableClient = new TableClient(
//       `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
//       TABLE_NAME,
//       credential
//     );

//     const cart = [];

//     // Replace 'user' with the actual user's identifier
//     const partitionKey = user; 

//     // Fetch all cart items for the user
//     for await (const entity of tableClient.listEntities({ queryOptions: { filter: `PartitionKey eq '${partitionKey}'` } })) {
//       cart.push({
//         id: entity.RowKey,
//         name: entity.productName,
//         price: entity.price,
//         quantity: entity.quantity,
//       });
//     }

//     return new Response(JSON.stringify({ cart }), { status: 200 });
//   } catch (error) {
//     console.error('Error fetching cart data:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch cart data' }), { status: 500 });
//   }
// }
