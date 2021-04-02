<template>
  <div class="m-dashboard m-dashboard-work m-dashboard-other" v-loading="loading">
    <div class="m-dashboard-work-header">
      <h2 class="u-title">我的铭牌</h2>
      <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small"> <i class="el-icon-document"></i> 创建铭牌 </a>
    </div>
    <div class="m-namespace-list">
      <div class="u-namespace-item" v-for="(item, i) in list" :key="i">
        <div class="u-item">
          <div class="u-box">
            <div class="u-title">
              <span class="el-icon-postcard u-icon"></span> <a class="u-title" target="_blank" :href="item.link">{{ item.key || '未知' }}</a>
            </div>
            <div class="u-desc">
              <span class="u-status u-desc-subitem">
                状态:
                <b :class="`status${item.status}`">{{ statusmap[item.status] }}</b>
              </span>
              <time class="u-time u-desc-subitem">提交于: {{ item.created | dateFormat }}</time>
            </div>
          </div>
          <el-button-group class="u-action">
            <el-button size="mini" icon="el-icon-edit" title="编辑" @click="edit(item.ID, item.source_type, item.source_id)"></el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="m-namespace-pages">
      <el-pagination background layout="total, prev, pager, next,jumper" :page-size="per" :total="total" :current-page.sync="page"> </el-pagination>
    </div>
  </div>
</template>

<script>
import { getNamespace } from '@/service/namespace'
import { getLink } from '@jx3box/jx3box-common/js/utils'
import dateFormat from '@/utils/dateFormat'
const statusmap = {
  '0': '待审核',
  '1': '正常启用',
  '2': '未通过审核',
}
export default {
  name: 'namespace',
  props: ['data'],
  data: function() {
    return {
      loading: false,
      list: [],
      statusmap,
      per: 16,
      total: 1,
      page: 1,
    }
  },
  computed: {
    params: function() {
      return {
        user_id: this.uid,
        page: this.page,
        limit: this.per,
      }
    },
    uid: function() {
      return this.$store.state.uid
    },
    publishLink: function() {
      return './#/' + 'namespace'
    },
  },
  methods: {
    edit: function(id, type, teamid) {
      if (type == 'team') {
        location.href = '/team/org/edit/' + teamid + '?tab=other'
        return
      }
      location.href = './#/namespace/' + id
    },
    loadData: function() {
      getNamespace(this.params)
        .then((res) => {
          this.list = res.data.data.data
          this.total = res.data.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  mounted: function() {
    this.loading = true
    this.loadData()
  },
  filters: {
    dateFormat: function(val) {
      return dateFormat(new Date(~~val * 1000))
    },
  },
  watch: {
    params: {
      deep: true,
      immediate: true,
      handler: function() {
        this.loadData()
      },
    },
  },
  components: {},
}
</script>

<style scoped lang="less">
@import '../assets/css/work.less';
@import '../assets/css/namespace.less';
.m-namespace-list {
  .mt(20px);
  .u-desc {
    .status0 {
      color: #fba524;
    }
    .status1 {
      color: #49c10f;
    }
    .status2 {
      color: #fc3c3c;
    }
  }
}
</style>
