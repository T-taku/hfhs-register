interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductsByClass {
    [registerType: string]: Product[];
}

const productsByClass: ProductsByClass = {
    "2年1組": [
        { id: 1, name: 'かき氷', price:200 },
        { id: 2, name: 'かき氷2', price:200 },
        { id: 3, name: 'かき氷3', price:200 },
        { id: 4, name: 'かき氷4', price:200 },
    ],
}

export default productsByClass;