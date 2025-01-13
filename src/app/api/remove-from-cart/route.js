// api/remove-from-cart/route.js

import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

export async function DELETE(req) {
  const TABLE_ACCOUNT_NAME = 'vipernest';
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY;
  const TABLE_NAME = 'azureAscendantsMeltyMagicCart';

  try {
    const { productId } = await req.json();

    if (!productId) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
    }

    const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
    const tableClient = new TableClient(
      `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
      TABLE_NAME,
      credential
    );

    // Replace 'user' with the actual user's identifier
    const partitionKey = 'user';

    // Delete the entity from the table
    await tableClient.deleteEntity(partitionKey, productId);

    return new Response(JSON.stringify({ message: 'Product removed from cart' }), { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove item from cart' }), { status: 500 });
  }
}
