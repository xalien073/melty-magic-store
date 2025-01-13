// api/add-to-cart/route.js

import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

export async function POST(req) {
  const TABLE_ACCOUNT_NAME = "vipernest";
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Ensure this is set in your environment variables
  const TABLE_NAME = "azureAscendantsMeltyMagicCart";

  try {
    const { user, productName, productPrice, productImage } = await req.json();
    console.log(user, productName, productPrice, productImage);

    if (!user || !productName || !productPrice || !productImage) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 }
      );
    }

    // Initialize Azure Table Storage client
    const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
    const tableClient = new TableClient(
      `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
      TABLE_NAME,
      credential
    );

    const partitionKey = user;
    const rowKey = productName;

    try {
      // Check if the entity already exists in the table
      const existingEntity = await tableClient.getEntity(partitionKey, rowKey);

      // Increment the quantity if it exists
      existingEntity.quantity = parseInt(existingEntity.quantity, 10) + 1;
      existingEntity.price = existingEntity.price * existingEntity.quantity;

      await tableClient.updateEntity(existingEntity, "Merge");
    } catch (error) {
      if (error.statusCode === 404) {
        // Add new entity if it doesn't exist
        const newEntity = {
          partitionKey,
          rowKey,
          price: productPrice,
          quantity: 1,
          imageUrl: productImage
        };
        console.log(newEntity);
        await tableClient.createEntity(newEntity);
      } else {
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ message: "Item added to cart successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add item to cart" }),
      { status: 500 }
    );
  }
}
