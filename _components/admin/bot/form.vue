<template>
  <!--Modal with form to category-->
  <q-modal
    id="formCategory"
    v-model="show"
    v-if="show"
    no-esc-dismiss
    no-backdrop-dismiss
    class="backend-page">
    <q-modal-layout style="max-width: 1245px">

      <!--Header-->
      <q-toolbar slot="header">
        <q-toolbar-title v-if="!itemId">New Bot</q-toolbar-title>
        <q-toolbar-title v-else>Update Bot ID: {{itemId}}</q-toolbar-title>
        <q-btn
          flat
          v-close-overlay
          icon="fas fa-times"/>
      </q-toolbar>

      <!--Footer-->
      <q-toolbar
        slot="footer"
        color="white">
        <q-toolbar-title></q-toolbar-title>
        <!--Button Save-->
        <q-btn
          icon="fas fa-save"
          color="positive"
          v-if="!itemId"
          label="Save"
          :loading="loading"
          @click="createItem()"/>
        <!--Button Update-->
        <q-btn
          label="Update"
          icon="fas fa-pen"
          color="positive"
          :loading="loading"
          @click="updateItem()"
          v-else/>
      </q-toolbar>

      <!--Content-->
      <div class="layout-padding relative-position">
        <div class="row gutter-x-md">
          <!--Language-->
          <div
            class="col-12" v-show="false">
            <span class="input-title q-mr-sm">
              Language
            </span>
            <locales
              v-model="locale"
              ref="localeComponent"
              @validate="$v.$touch()"/>
          </div>
          <div class="col-12" v-if="locale.success">
            <div class="row gutter-x-sm">
              <div class="col-6">
              <q-field
                :error="$v.locale.formTemplate.userId.$error"
                error-label="This field is required">
                <div class="input-title">User</div>
                <treeselect
                  :clearable="false"
                  :options="users"
                  value-consists-of="BRANCH_PRIORITY"
                  v-model="locale.formTemplate.userId"
                  placeholder=""/>
              </q-field>
              </div>
              <div class="col-6 q-mt-sm">
                <q-field
                  :error="$v.locale.formTemplate.projectId.$error"
                  error-label="This field is required">
                  <q-input
                    stack-label="Project Id"
                    type="text"
                    v-model="locale.formTemplate.projectId"/>
                </q-field>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-field
                  :error="$v.locale.formTemplate.credentials.$error"
                  error-label="This field is required">
                  <q-input
                    stack-label="Credentials"
                    type="textarea"
                    rows="10"
                    v-model="locale.formTemplate.credentials"/>
                </q-field>
              </div>
            </div>
          </div>
        </div>
        <!--Loading-->
        <inner-loading :visible="loading" />
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  //Services
  import service from '@imagina/qbot/_services/index';
  //Components
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import locales from '@imagina/qsite/_components/locales'
  import innerLoading from 'src/components/master/innerLoading'
  //Plugins
  import {required} from 'vuelidate/lib/validators'
  import _cloneDeep from 'lodash.clonedeep'

  export default {
    props: {
      value: {
        default: false
      },
      itemId: {
        default: false
      }
    },
    components: {
      Treeselect,
      locales,
      innerLoading
    },
    watch: {
      value(newValue) {
        this.show = this.value
      },
      show(newValue) {
        this.$emit('input', this.show)
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.initForm()
      })
    },
    validations() {
      return this.getObjectValidation()
    },
    filters:{
      stringify(value){
        return JSON.stringify(value)
      }
    },
    data() {
      return {
        show: false,
        locale: _cloneDeep(this.dataLocale),
        editorText: {
          toolbar: [
            ['bold', 'italic', 'strike', 'underline', 'removeFormat'],
            ['link'],
            [
              {
                label: 'Font Size',
                icon: 'format_size',
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
              }
            ],
            ['quote', 'unordered', 'ordered'],
            ['fullscreen']
          ]
        },
        loading: false,
        categories: [],
        users:[],
      }
    },
    computed: {
      //Data locale component
      dataLocale() {
        return {
          fields: {
            userId:null,
            projectId:'',
            credentials:''
          },
          fieldsTranslatable: {},
          validations: {
            userId: {required},
            projectId: {required},
            credentials: {required}
          }
        }
      }
    },
    methods: {
      //Init form
      async initForm() {
        this.loading = true
        //If ther is category Id, request data, else set default data
        if (this.itemId) await this.getDataItem()
        else this.locale = _cloneDeep(this.dataLocale)
        this.getUsers() //Optiene Users
        this.$v.$reset()//Reset validations
        this.show = this.value//Assign props value to show modal
        this.loading = false
      },
      //Get data category to update
      getDataItem() {
        return new Promise((resolve, reject) => {
          let configName = 'apiRoutes.qbot.bots'
          let params = {//Params to request
            refresh: true,
            params: {
              //include: 'parent',
              filter: {
                //allTranslations: true
              }
            }
          }
          //Request
          service.crud.show(configName, this.itemId, params).then(response => {
            this.locale.form = _cloneDeep(response.data)
            resolve(true)
          }).catch(error => {
            this.$helper.alert.error('Failed: ' + error, 'bottom')
            reject(false)
          })
        })
      },
      getUsers(){
        let params = {
          refresh: true,
        }
        let configName = 'apiRoutes.quser.users'
        service.crud.index(configName, params).then(response => {
          this.users = response.data.map( item => ({id: item.id, label: item.fullName})) //this.$helper.array.tree()
        }).catch(error => {
          this.$helper.alert.error('Failed: ' + error, 'bottom')
        })
      },
      //Get product categories
      getCategories() {

      },
      //Create Category
      createItem() {
        this.$refs.localeComponent.vTouch()//Validate component locales
        //Check validations
        if (!this.$v.$error) {
          this.loading = true
          let configName = 'apiRoutes.qbot.bots'
          service.crud.create(configName, this.locale.form).then(response => {
            this.$helper.alert.success('Bot created ID: ' + response.data.id)
            this.initForm()
            this.loading = false
            this.show = false
            this.$emit('created', response.data)
          }).catch(error => {
            this.loading = false
            this.$helper.alert.error('Failed: ' + error)
          })
        }else{
          this.$helper.alert.error('Please check required fields','bottom')
        }
      },
      //Update Category
      updateItem() {
        this.$refs.localeComponent.vTouch()//Validate component locales
        //Check validations
        //this.locale.form.credentials = JSON.stringify(this.locale.form.credentials)
        if (!this.$v.$error) {
          this.loading = true
          let configname = 'apiRoutes.qbot.bots'
          service.crud.update(configname, this.itemId, this.locale.form).then(response => {
            this.$helper.alert.success('Bot updated ID: ' + this.itemId)
            this.initForm()
            this.loading = false
            this.show = false
            this.$emit('updated', response.data)
          }).catch(error => {
            this.loading = false
            this.$helper.alert.error('Failed: ' + error)
          })
        }else{
          this.$helper.alert.error('Please check required fields','bottom')
        }
      },
      //Return object to validations
      getObjectValidation() {
        let response = {}
        if (this.locale && this.locale.formValidations)
          response = {locale: this.locale.formValidations}
        return response
      },
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
</style>
