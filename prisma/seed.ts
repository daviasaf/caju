import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Camisetas', slug: 'camisetas', description: 'Peças autorais com alma de Quissamã.', color: '#D71920', icon: 'i-lucide-shirt', order: 1 },
  { name: 'Regatas', slug: 'regatas', description: 'Verão, praia e conforto para circular.', color: '#F47C20', icon: 'i-lucide-sun', order: 2 },
  { name: 'Bonés', slug: 'bones', description: 'Acessórios bordados com identidade local.', color: '#6D7A3B', icon: 'i-lucide-badge', order: 3 },
  { name: 'Canecas', slug: 'canecas', description: 'Peças afetivas para levar Quissamã para casa.', color: '#028CE8', icon: 'i-lucide-coffee', order: 4 },
  { name: 'Papelaria', slug: 'papelaria', description: 'Cadernos, blocos e kits criativos.', color: '#FFC928', icon: 'i-lucide-notebook-tabs', order: 5 },
  { name: 'Kits', slug: 'kits', description: 'Presentes com cara de CAJU.', color: '#385A6F', icon: 'i-lucide-gift', order: 6 }
]

const collections = [
  { name: 'Fim de Ano', slug: 'fim-de-ano', description: 'Peças solares para fechar o ano com Quissamã no peito.', highlightColor: '#D71920', featured: true, order: 1, image: '/uploads/seed/camiseta-quissa-quissama.jpg' },
  { name: 'Especial Outubro', slug: 'especial-outubro', description: 'Azul jeans, memória local e estética casual.', highlightColor: '#385A6F', order: 2, image: '/uploads/seed/camiseta-quissama-1989.jpg' },
  { name: 'Quissamã Lifestyle', slug: 'quissama-lifestyle', description: 'Produtos para viver a cidade no dia a dia.', highlightColor: '#028CE8', order: 3, image: '/uploads/seed/caneca-quissama-lifestyle.jpg' },
  { name: 'Flora de Jurubatiba', slug: 'flora-de-jurubatiba', description: 'Botânica, restinga e delicadeza em forma de camiseta.', highlightColor: '#EAD8A6', order: 4, image: '/uploads/seed/camiseta-flora-jurubatiba.jpg' },
  { name: 'Made in Quissa', slug: 'made-in-quissa', description: 'Acessórios com orgulho regional bordado.', highlightColor: '#6D7A3B', order: 5, image: '/uploads/seed/bone-made-in-quissa.jpg' }
]

const products = [
  ['Caneca Quissamã Lifestyle','caneca-quissama-lifestyle','Caneca térmica azul com ilustrações solares de Quissamã.','Uma caneca com cara de verão, praia, cadeira, chinelo, caju e cotidiano local.','69.00','canecas','quissama-lifestyle','/uploads/seed/caneca-quissama-lifestyle.jpg',['Único'],['Azul navy'],['Térmica','Aço inox'],['lançamento','lifestyle','presente'],true,12,1],
  ['Camiseta Flora de Jurubatiba Bege Estonada','camiseta-flora-de-jurubatiba-bege-estonada','Camiseta bege estonada com ilustrações botânicas da restinga.','Uma homenagem à flora de Jurubatiba, com visual delicado, orgânico e regional.','109.00','camisetas','flora-de-jurubatiba','/uploads/seed/camiseta-flora-jurubatiba.jpg',['P','M','G','GG','G2'],['Bege estonado'],['Algodão'],['flora','jurubatiba','estonada'],true,8,2],
  ['Regata Verão JF Off White Estonada','regata-verao-jf-off-white-estonada','Regata off white estonada com ilustração de verão em JF.','Peça leve, com estampa divertida e clima de praia.','99.00','regatas','fim-de-ano','/uploads/seed/regata-verao-jf.jpg',['P','M','G','GG'],['Off white estonado'],['Algodão'],['verão','praia','fim de ano'],true,10,3],
  ['Camiseta Quissa Quissamã Vermelha','camiseta-quissa-quissama-vermelha','Camiseta vermelha com lettering Quissa Quissamã.','Vermelho forte, lettering branco e orgulho local no peito.','99.00','camisetas','fim-de-ano','/uploads/seed/camiseta-quissa-quissama.jpg',['P','M','G','GG','G2'],['Vermelho'],['Algodão'],['quissa','quissamã','vermelha'],true,15,4],
  ['Boné Made in Quissa Verde Oliva','bone-made-in-quissa-verde-oliva','Boné verde oliva com bordado bege Made in Quissa.','Bordado limpo, cor urbana e assinatura regional.','99.00','bones','made-in-quissa','/uploads/seed/bone-made-in-quissa.jpg',['Ajustável'],['Verde oliva'],['Sarja','Bordado'],['bordado','made in quissa','acessório'],false,7,5],
  ['Kit Papelaria Caju','kit-papelaria-caju','Kit com caderno, bloco e chaveiro em azul CAJU.','Papelaria afetiva com identidade visual marcante.','109.00','papelaria','quissama-lifestyle','/uploads/seed/kit-papelaria-caju.jpg',['Único'],['Azul Caju'],['Papel','Acrílico'],['papelaria','kit','presente'],false,6,6],
  ['Caneca Baobá','caneca-baoba','Caneca branca com arte Baobá — raízes de Quissamã.','Caneca minimalista inspirada no Baobá e nas raízes locais.','49.00','canecas','quissama-lifestyle','/uploads/seed/caneca-baoba.jpg',['Único'],['Branca'],['Cerâmica'],['baobá','caneca','presente'],false,14,7],
  ['Camiseta Quissamã 1989 Azul Jeans','camiseta-quissama-1989-azul-jeans','Camiseta azul jeans com estampa college Quissamã 1989.','Peça casual com visual college e referência à emancipação de Quissamã.','99.00','camisetas','especial-outubro','/uploads/seed/camiseta-quissama-1989.jpg',['P','M','G','GG','G2'],['Azul jeans'],['Algodão'],['1989','azul jeans','college'],true,11,8]
] as const

async function main() {
  await prisma.adminLog.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.storeSettings.deleteMany()

  for (const data of categories) await prisma.category.create({ data })
  for (const data of collections) await prisma.collection.create({ data })

  const cats = await prisma.category.findMany()
  const cols = await prisma.collection.findMany()

  for (const p of products) {
    const [name, slug, shortDescription, description, price, catSlug, colSlug, image, sizes, colors, materials, tags, featured, stock, order] = p
    const category = cats.find((c) => c.slug === catSlug)
    const collection = cols.find((c) => c.slug === colSlug)
    await prisma.product.create({
      data: {
        name, slug, shortDescription, description,
        price: new Prisma.Decimal(price),
        categoryId: category?.id,
        collectionId: collection?.id,
        sizes: [...sizes],
        colors: [...colors],
        materials: [...materials],
        tags: [...tags],
        featured,
        active: true,
        stock,
        order,
        seoTitle: `${name} | CAJU`,
        seoDescription: shortDescription,
        images: { create: [{ url: image, alt: name, order: 0 }] }
      }
    })
  }

  const featuredCollection = await prisma.collection.findUnique({ where: { slug: 'fim-de-ano' } })
  const featuredProduct = await prisma.product.findUnique({ where: { slug: 'camiseta-quissama-1989-azul-jeans' } })

  await prisma.storeSettings.create({
    data: {
      id: 'settings_default',
      storeName: 'CAJU',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '5522981124709',
      instagram: 'https://instagram.com/vistacaju',
      city: 'Quissamã',
      state: 'RJ',
      heroTitle: 'Vista Quissamã.',
      heroSubtitle: 'Produtos com alma local, feitos para circular pelo Brasil. Coleções autorais inspiradas no nosso chão.',
      heroImage: '/uploads/seed/camiseta-quissama-1989.jpg',
      featuredCollectionId: featuredCollection?.id,
      featuredProductId: featuredProduct?.id,
      paymentText: 'Pix, cartão e dinheiro. Vendas online via WhatsApp.',
      shippingText: 'Envio para todo o Brasil e retirada em Quissamã - RJ.',
      seoTitle: 'CAJU — Vista Quissamã',
      seoDescription: 'Produtos autorais da CAJU inspirados em Quissamã, praia, natureza e cultura local.'
    }
  })

  await prisma.adminLog.create({ data: { action: 'seed', entity: 'system', title: 'Seed inicial executado' } })
}

main().then(() => prisma.$disconnect()).catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
