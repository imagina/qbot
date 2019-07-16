<template>
  <div>
    <q-field>
      <q-input
        @keyup.enter="addItem()"
        type="text"
        v-model="tmp"
        float-label="Enter a Text Response"/>
    </q-field>
    <div class="q-mt-md">
      <q-list separator v-if="intent.messageTexts.length">
        <q-item v-for="(message, index) in intent.messageTexts" :key="index">
          <q-item-main>
           {{message}}
          </q-item-main>
          <q-item-side right>
            <q-btn
              color="negative"
              icon="delete_outline"
              @click="deleteItem(message)"
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
            messageTexts:[],
          }
        }
      }
    },
    data(){
      return{
        tmp:''
      }
    },
    methods:{
      addItem(){
        if (this.tmp != ''){
          this.intent.messageTexts.push(this.tmp)
          //this.intent.messages.push({text: this.tmp})
          this.tmp = ''
        }
      },
      deleteItem(message){
        let index =  this.intent.messageTexts.findIndex(item => item === message)
        //let index = this.intent.messages.findIndex(item => item === message)
        this.intent.messageTexts.splice(index, 1)
        //this.intent.messages.splice(index, 1)
      }
    }
  }
</script>
