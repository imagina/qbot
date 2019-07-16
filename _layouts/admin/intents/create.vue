<template>
  <div class="q-container">
    <div class="row gutter-y-sm">
      <div class="col-12 q-mt-md">
        <q-toolbar
          slot="header"
          inverted
          class="flex justify-between">
          <div>
            <q-icon
              name="far fa-comment-dots"
              size="25px"/>
            <span>
              {{intent.displayName}}
            </span>
          </div>
          <q-btn-group>
            <q-btn
              label="Back"
              icon="fas fa-long-arrow-alt-left"
              :to="{name:'qbot.bots.show',params: {botId:$route.params.botId}}"
              color="secondary"/>
            <q-btn
              icon="far fa-save"
              @click="save()"
              label="Save Intent"
              color="primary">
            </q-btn>
          </q-btn-group>
        </q-toolbar>
      </div>
      <div class="col-12">
        <div class="row gutter-x-sm">
          <div class="col-12">
            <q-field
              error-label="Field Required"
              :error="$v.intent.displayName.$error">
              <q-input
                type="text"
                v-model="intent.displayName"
                float-label="Name"/>
            </q-field>
          </div>
        </div>
      </div>
      <div class="col-12">
        <q-list separator>
          <q-collapsible opened  label="Training phrases">
            <trainingPrases :intent="intent"/>
          </q-collapsible>
          <q-collapsible opened label="Responses">
            <responses :intent="intent"/>
          </q-collapsible>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import trainingPrases from 'src/components/qchatbot/intents/trainingPhrase'
  import responses from 'src/components/qchatbot/intents/responses'
  import service from '@imagina/qbot/_services/index';
  
  export default {
    components:{
      trainingPrases,
      responses
    },
    data(){
      return{
        intent:{
          displayName:'',
          priority:'',
          trainingPhraseParts:[],
          messageTexts:[],
          projectId:this.$route.params.botId
        }
      }
    },
    validations:{
      intent:{
        displayName:{required}
      }
    },
    mounted(){},
    methods:{
      save(){
        this.$v.$touch()
        if (this.$v.$error) {
          this.$helper.alert.error('Validation Error')
        } else {
          service.crud.create('apiRoutes.qbot.intens', this.intent)
          .then(response=>{
            this.$router.push({name:'qbot.bots.show',params: {botId:this.$route.params.botId}})
            this.$helper.alert.success('Intent Created')
            this.loading = false
          })
          .catch(error => {
            console.warn(`Error ${error}`)
            this.loading = false
          })
        }
      }
    }
  }
</script>
