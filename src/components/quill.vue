<template>
  <div
    >
    <quill-editor
      ref="newEditor"
      :options="newOption"
      style="height: 100%; margin-bottom: 54px"
      v-model="editorContent"
      @change="editorChange">
    </quill-editor>
    <form action="/shop/web/banner/upload" method="post" enctype="multipart/form-data" id="uploadFormMulti">
      <input style="display: none" ref="referenceUpload" :id="uniqueId" type="file" name="avator" multiple @change="uploadImg('uploadFormMulti')">
    </form>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor'
  import { uploadGoodsDetailPic } from '@/api/product/goods'
  import Quill from 'quill'
  import axios from '@/router/axios'
  import { ImageImport } from './modules/ImageImport.js'
  import { ImageResize } from './modules/ImageResize.js'
  Quill.register('modules/imageImport', ImageImport)
  Quill.register('modules/imageResize', ImageResize)
  
  var defaultToolbar =  [
              //[{ 'size': ['small', false, 'large', 'huge'] }],  
              ['bold', 'italic', 'underline'],
              ['blockquote'],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image','video'],
              [{'size': ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '25px', '30px']}]
              // [{'size': ['0.26rem', '0.31rem', '0.37rem', '0.41rem', '0.47rem', '0.52rem']}]
            ]
  export default {
    props: ['text', 'editorId'],
    components: {quillEditor},
    data(){
      return {
        editorContent: '',
        uniqueId: '',
        imgPercent: 0,
        imageLoading: false,
        newOption: {
          placeholder: '请填写简介',
          history: {
            delay: 100,
            maxStack: 100,
            userOnly: false
          },
          modules: {
            toolbar: defaultToolbar,
            imageImport: true,
            imageResize: {
              displaySize: true
            },
          },
          strict: false,//should be false for ignore unexpected update
        },
        addImgRange: '',//全局参数，每次添加图片时记录当前索引和长度
        quill: null
      }
    },
    computed: {
    },
    methods: {
      editorChange({ editor, html, text }) {
        var vm = this
        vm.$emit('editorChange', html)
      },
      uploadImg: async function(id) {
        console.log(id,'id')
        var vm = this
        vm.imageLoading = true
        //var formData = new FormData($('#' + id)[0])
        let tempFile = Array.from(this.$refs.referenceUpload.files).reverse();
        console.log(tempFile,'图片文件');

        this.$refs.referenceUpload.value = null;
        // tempFile.forEach((item) => {
          
        // })
        //var formData = new FormData(tempFile);
        try {
          for(let i=0; i<tempFile.length; i++){
            const url = await vm.uploadImgReq(tempFile[i])
            console.log(url)
            if (url !== null && url.length > 0) {

              var value = url
              value = value.indexOf('http') !== -1 ? value : 'https:' + value //返回图片网址中如果没有http自动拼接
              let index = vm.addImgRange !== null?vm.addImgRange.index:0 // 获取插入时的位置索引，如果获取失败，则插入到最前面
              let fileType = tempFile[i].type.split('/')[0];
              if(fileType == 'video'){
                vm.$refs.newEditor.quill.insertEmbed(index , 'video', value, Quill.sources.USER)
              }else{
                vm.$refs.newEditor.quill.insertEmbed(index , 'image', value, Quill.sources.USER)
                var img = new Image()
                img.src = value
                vm.$refs.newEditor.quill.formatText(index, index + 1, 'width', 100 + '%');
              }
            } else {

            }
            document.getElementById(vm.uniqueId).value=''
          }
          


        } catch ({message: msg}) {
          document.getElementById(vm.uniqueId).value=''

        }
        vm.imageLoading = false
      },
      uploadImgReq (formData) {
        // 这里实现你自己的图片上传
        let formdata = new FormData();
        formdata.append('file',formData);
        let pic = '';
        return new Promise((resolve, reject) => {
            axios({
                url: '/shop/web/handy/upload',
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formdata
            }).then((res) => {
                resolve(res.data)
            });
        })
      },
    },
    created: function () {
      var vm = this
      vm.imgPercent = 0
      vm.editorContent = vm.text
      vm.uniqueId = vm.editorId?vm.editorId:'inputImg'
    },
    watch:{
      text: function () {
        var vm = this
        vm.editorContent = vm.text
      }
    },
    mounted() {
      var vm =this
      // you can use current editor object to do something(quill methods)
        var Size = Quill.import('attributors/style/size');
        Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '25px', '30px'];
        Quill.register(Size, true);

      var imgHandler = async function(image) {
        vm.addImgRange = vm.$refs.newEditor.quill.getSelection()
        if (image) {
          var fileInput = document.getElementById(vm.uniqueId) //隐藏的file文本ID
          fileInput.click() //加一个触发事件
        }
      }

      

      vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
    }

  }
</script>
<style lang='scss' scoped>
.quill-editor {
  height: 745px;
}
.quill-editor  .ql-container {
    height: 680px;
  }

.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;
}
.limit span {
    color: #ee2a7b;
  }

.ql-snow .ql-editor img {
  width: 100%!important;
  vertical-align: top!important;
}

.ql-editor .ql-video {
  max-width: 480px;
}
.ql-editor p{
  font-size: 0!important;
}
.ql-toolbar.ql-snow + .ql-container.ql-snow {
  padding: 0 500px!important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
    content: '10px';
    font-size: 10px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
    content: '20px';
    font-size: 20px;
}
/* //默认的样式 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
    font-size: 14px;
}
</style>
