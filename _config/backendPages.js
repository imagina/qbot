//Layout container
import master from 'src/layouts/master'
import blank from 'src/layouts/blank'
import vcrud from '@imagina/qcrud/_components/vueCrud'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
  //Bot List
	bots: {
		permission: null,
		activated: true,
		path: '/qbot/bots',
		name: 'qbot.bots.index',
		layout: require('@imagina/qbot/_layouts/admin/bots/index').default,
		containerLayout: master,
		title: 'Bots List',
		icon: 'fas fa-boxes',
		middleware: [auth,access]
	},
  botsShow: {
    permission: null,
    activated: true,
    path: '/qbot/bots/:botId',
    name: 'qbot.bots.show',
    layout: require('@imagina/qbot/_layouts/admin/intents/index').default,
    containerLayout: master,
    title: 'Bots List',
    icon: 'fas fa-boxes',
    middleware: [auth,access]
  },
  intentIndex: {
    permission: null,
    activated: true,
    path: '/intents',
    name: 'qbot.intents.index',
    layout: require('@imagina/qbot/_layouts/admin/intents/index').default,
    containerLayout: master,
    title: 'Intents',
    icon: 'far fa-comment-dots',
    middleware: [auth]
  },
  intentCreate: {
    permission: null,
    activated: true,
    path: '/intents/create/:botId',
    name: 'qbot.intents.create',
    layout: require('@imagina/qbot/_layouts/admin/intents/create').default,
    containerLayout: master,
    title: 'Intents Create',
    icon: 'fas fa-home',
    middleware: [auth]
  },
  intentShow: {
    permission: null,
    activated: true,
    path: '/intents/show/:intentName/:botId',
    name: 'qbot.intents.show',
    layout: require('@imagina/qbot/_layouts/admin/intents/show').default,
    containerLayout: master,
    title: 'Intents Show',
    icon: 'fas fa-home',
    middleware: [auth]
  },
}
