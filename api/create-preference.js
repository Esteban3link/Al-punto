export default async function handler(req, res) {
    // Solo aceptamos peticiones de tipo POST (compras)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { items } = req.body;

    try {
        // Nos conectamos directamente a los servidores de Mercado Pago
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: items,
                back_urls: {
                    success: `https://${req.headers.host}`,
                    failure: `https://${req.headers.host}`,
                    pending: `https://${req.headers.host}`
                },
                auto_return: 'approved'
            })
        });

        const data = await response.json();

        // Le devolvemos el ID de la compra a tu index.html
        return res.status(200).json({ id: data.id });

    } catch (error) {
        console.error("Error en Mercado Pago:", error);
        return res.status(500).json({ error: error.message });
    }
}
