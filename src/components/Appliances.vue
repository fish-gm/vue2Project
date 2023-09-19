<template>
  <div>
    <img :src="item.img_url" v-for="(item,index) in cellsAutoFill">
  </div>
</template>

<script>
import { PageTypeActivity } from '../api/api.js'
import Pro from '../components/Pro.vue'

export default {
  name: 'Appliances',
  components: {
    Pro
  },
  data() {
    return {
      isFlag: false,
      sections: [],
      cellsAutoFill: [],
    }
  },
  created() {
    PageTypeActivity(18642).then(res => {
      this.isFlag = true;
      this.sections = res.data.data.data.sections;

      this.sections.forEach(ite => {
        // 满屏图片
        if (ite.view_type === 'cells_auto_fill') {
          this.cellsAutoFill.push(...ite.body.items)
        }
      })
      console.log(this.cellsAutoFill);
    }).catch(err => {
      console.log('Television err=>', err);
    })
  },
}
</script>

<style lang="scss" scoped>
img{
  width: 100%;
}
</style>