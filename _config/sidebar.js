const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'Bots',
    icon: 'fas fa-robot',
    children: [
      pages.qbot.bots,//products index
    ]
  },
]
