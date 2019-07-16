<template>
  <div>
    <q-field>
      <q-input
        @keyup.enter="addTrainingPhrase()"
        type="text"
        v-model="trainingPhrasesTmp"
        float-label="Training Phrases"
        :before="[{icon: 'format_quote'}]"/>
    </q-field>
    <div class="q-mt-md">
      <q-list separator v-if="intent.trainingPhraseParts.length">
        <q-item v-for="(part, index) in intent.trainingPhraseParts" :key="index">
          <q-item-side icon="format_quote" />
          <q-item-main>
            <label>
              {{part}}
            </label>
          </q-item-main>
          <q-item-side right>
            <q-btn
              color="negative"
              icon="delete_outline"
              @click="deletePhrase(phrase)"
              flat dense rounded/>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      intent:{
        type:Object,
        default:()=>{
          return{
            trainingPhraseParts:[],
          }
        }
      }
    },
    data(){
      return{
        trainingPhrasesTmp:''
      }
    },
    methods:{
      addTrainingPhrase(){
        if (this.trainingPhrasesTmp != ''){
          this.intent.trainingPhraseParts.push(this.trainingPhrasesTmp)
          this.trainingPhrasesTmp = ''
        }
      },
      deletePhrase(phrase){
        let index = this.intent.trainingPhraseParts.findIndex(item => item === phrase)
        this.intent.trainingPhraseParts.splice(index, 1)
      }
    }
  }
</script>
