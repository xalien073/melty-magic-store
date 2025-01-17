// api/get-cart/route.js

import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

export async function GET(req) {
  console.log("API Endpoint Hit: /api/get-cart");

  const url = new URL(req.url);
  const timestamp = url.searchParams.get("timestamp");
  const user = url.searchParams.get("user");

  if (!timestamp) {
    console.error("Missing timestamp parameter.");
    return new Response(
      JSON.stringify({ error: "Missing timestamp parameter." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }

  if (!user) {
    console.error("Missing user identifier.");
    return new Response(
      JSON.stringify({ error: "User identifier is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }

  const TABLE_ACCOUNT_NAME = 'vipernest';
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY;
  const TABLE_NAME = 'azureAscendantsMeltyMagicCart';

  if (!TABLE_ACCOUNT_KEY) {
    console.error("Azure Table Storage account key is not configured.");
    return new Response(
      JSON.stringify({ error: "Azure Table Storage account key is not configured." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }

  try {
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
        price: entity.price,
        quantity: entity.quantity,
        imageUrl: entity.imageUrl,
      });
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    console.log(`Cart data fetched for user: ${user} at timestamp: ${timestamp}`);
    return new Response(JSON.stringify({ cart }), { status: 200, headers });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}


// // api/get-cart/route.js

// import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

// export async function GET(req) {
//   const TABLE_ACCOUNT_NAME = 'vipernest';
//   const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY;
//   const TABLE_NAME = 'azureAscendantsMeltyMagicCart';
//   try {
//     // Extract user identifier from query parameters
//     const { searchParams } = new URL(req.url);
//     const user = searchParams.get("user"); // Assuming 'user' is passed as a query parameter
//     console.log(user);

//     if (!user) {
//       return new Response(
//         JSON.stringify({ error: "User identifier is required" }),
//         { status: 400 }
//       );
//     }

//     const credential = new AzureNamedKeyCredential(
//       TABLE_ACCOUNT_NAME,
//       TABLE_ACCOUNT_KEY
//     );
//     const tableClient = new TableClient(
//       `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
//       TABLE_NAME,
//       credential
//     );

//     const cart = [];

//     // Fetch all cart items for the user
//     for await (const entity of tableClient.listEntities({
//       queryOptions: { filter: `PartitionKey eq '${user}'` },
//     })) {
//       cart.push({
//         name: entity.rowKey,
//         // name: entity.productName,
//         price: entity.price,
//         quantity: entity.quantity,
//         imageUrl: entity.imageUrl
//       });
//     }
//     console.log('cart');
//     console.log(cart);
//     return new Response(JSON.stringify({ cart }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching cart data:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch cart data" }),
//       { status: 500 }
//     );
//   }
// }
