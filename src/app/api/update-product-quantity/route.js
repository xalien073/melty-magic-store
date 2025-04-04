// api/update-product-quantity/route.js

import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

export async function PATCH(req) {
  const TABLE_ACCOUNT_NAME = "vipernest";
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Ensure this is set in your environment variables
  const TABLE_NAME = "azureAscendantsMeltyMagicCart";

  try {
    const { user, productName, quantity } = await req.json();
    console.log(user, productName, quantity);

    if (!user || !productName || quantity === undefined) {
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
      // Fetch the existing entity
      const existingEntity = await tableClient.getEntity(partitionKey, rowKey);

      // Update the quantity
      if (quantity === 0) {
        // Remove product from cart if quantity is 0
        await tableClient.deleteEntity(partitionKey, rowKey);
        return new Response(
          JSON.stringify({ message: "Product removed from cart" }),
          { status: 200 }
        );
      } else {
        existingEntity.quantity = quantity;
        existingEntity.price = existingEntity.price * quantity;
        await tableClient.updateEntity(existingEntity, "Merge");

        return new Response(
          JSON.stringify({ message: "Quantity updated successfully" }),
          { status: 200 }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Product not found in cart" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update quantity" }),
      { status: 500 }
    );
  }
}
