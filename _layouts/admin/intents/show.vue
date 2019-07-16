<template>
  <div class="relative-position">
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
                @click="updateIntent()"
                icon="far fa-edit"
                label="Update Intent"
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
              <pre v-show="false">{{intent}}</pre>
              <trainingPrases :intent="intent"/>
            </q-collapsible>
            <q-collapsible opened label="Responses">
              <responses :intent="intent"/>
            </q-collapsible>
          </q-list>
        </div>
        
      </div>
    </div>
    <loading :visible="loading"></loading>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import trainingPrases from 'src/components/qchatbot/intents/trainingPhrase'
  import responses from 'src/components/qchatbot/intents/responses'
  import loading from 'src/components/master/innerLoading'
  import service from '@imagina/qbot/_services/index';
  export default {
    components:{
      loading,
      responses,
      trainingPrases,
    },
    data(){
      return{
        loading: false,
        intent:{
          name:'',
          displayName:'',
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
    mounted(){
      this.$nextTick(() => {
        this.getIntent()
      })
    },
    methods:{
      getIntent(){
        this.loading = true
        let params = {
          params: {
            filter: {
              project:this.$route.params.botId
            },
          }
        }
        let criteria = this.$route.params.intentName
        service.crud.show('apiRoutes.qbot.intens', criteria, params)
          .then(response=>{
            this.intent.name = response.data.name || ''
            this.intent.displayName = response.data.displayName || ''
            this.intent.trainingPhraseParts = response.data.trainingPhraseParts || []
            this.intent.messageTexts = response.data.messageTexts || []
            this.loading = false
          })
          .catch(error => {
            console.warn(`Error ${error}`)
            this.loading = false
        })
      },
      updateIntent(){
        this.loading = true
        let params = {
          params: {
            filter: {
              project:this.$route.params.botId
            },
          }
        }
        let criteria = this.$route.params.intentName
        service.crud.update('apiRoutes.qbot.intens', criteria, this.intent)
        .then(response=>{
          this.$router.push({name:'qbot.bots.show', params: {botId:this.$route.params.botId}})
          this.$helper.alert.success('Intent Updated')
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
