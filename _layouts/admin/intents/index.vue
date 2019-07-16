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
                Intents
              </span>
            </div>
          <q-btn-group>
            <q-btn
              label="Back"
              icon="fas fa-long-arrow-alt-left"
              :to="{name: 'qbot.bots.index'}"
              color="secondary"/>
            <q-btn
              icon="fas fa-plus"
              label="Create Intent"
              :to="{name:'qbot.intents.create',params:{botId:$route.params.botId} }"
              color="primary">
              <q-tooltip :delay="300">Add new Intent</q-tooltip>
            </q-btn>
            <q-btn
              @click="getIntents(true)"
              icon="fas fa-sync-alt"
              color="info">
              <q-tooltip :delay="300">Refresh Data</q-tooltip>
            </q-btn>
          </q-btn-group>
        </q-toolbar>
      </div>
      <div class="col-12">
        <q-search
          v-show="true"
          v-model="search"
          :debounce="600"
          placeholder=" "
          clearable
          @input="searchInten()"
          float-label="Search Intents"/>
      </div>
      <div class="col-12 relative-position">
        <q-list separator>
          <q-item
            v-for="(intent, index) in intents"
            :key="index">
            <q-item-side
              icon="bookmark_border"
              :color="getColorPriority(intent.priority)"
              v-if="intent.isFallback"/>
            <q-item-side
              icon="lens"
              :color="getColorPriority(intent.priority)"
              v-else/>
            <q-item-main
              :label="intent.displayName"/>
            <q-item-side right>
              <q-btn
                icon="far fa-eye"
                dense
                flat
                color="info"
                :to="{name:'qbot.intents.show',params:{intentName:getNameIntent(intent.name), botId:$route.params.botId} }"
                rounded/>
            </q-item-side>
            <q-item-side right>
              <q-btn
                icon="delete_outline"
                dense
                flat
                color="negative"
                @click="deleteIntent( intent )"
                rounded/>
            </q-item-side>
          </q-item>
        </q-list>
        <loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '@imagina/qbot/_services/index';
  import loading from 'src/components/master/innerLoading'
  export default {
    components:{
      loading
    },
    data(){
      return{
        loading:false,
        search:'',
        intents:[]
      }
    },
    created(){
      this.getIntents(false)
    },
    methods:{
      getIntents(refresh){
        this.loading = true
        let params = {
          refresh: refresh,
          params: {
            filter: {
              project:this.$route.params.botId
            },
          }
        }
        service.crud.index('apiRoutes.qbot.intens', params)
          .then(response=>{
            this.loading = false
            this.intents = response.data
          }).catch(error => {
            this.loading = false
            console.warn(`Error ${error}`)
        })
      },
      //Delete Intent
      deleteIntent(intent){
        this.loading = true
        this.$q.dialog({
          title: intent.displayName,
          message: 'Do you want delete this Intent?',
          color: 'negative',
          ok: 'Delete',
          cancel: true
        })
        .then(data => {
          service.deleteIntent('apiRoutes.qbot.intens', this.getNameIntent(intent.name), this.$route.params.botId)
            .then(response=>{
              this.getIntents(true)
              console.warn('deleting', intent)
            }).catch(error => {
            this.loading = false
            console.warn(`Error ${error}`)
          })
        })
        .catch(data => {
          this.loading = false
        })
      },
      getNameIntent(IntenName){
        let stringSeparated = IntenName.split('/')
        return stringSeparated[stringSeparated.length-1]
      },
      searchInten(){
        if(this.search != ''){
          let result = []
          this.intents.forEach(intent => {
            if (intent.displayName.indexOf(this.ucwords(this.search)) > -1){
              result.push(intent)
            }
          })
          this.intents = result
        } else {
          this.getIntents(false)
        }
      },
      ucwords(sentence){
        return sentence.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){
          return $1.toUpperCase();
        });
      },
      getColorPriority(priority){
        switch (priority) {
          case 1000000:
            return 'red'
          case 750000:
            return 'orange'
          case 500000:
            return 'blue'
          case 250000:
            return 'green'
          default:
            return 'grey'
        }
      }
    }
  }
</script>
