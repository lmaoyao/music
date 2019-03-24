<template>
  <!-- 搜索历史组件 -->
  <div class="search-list" v-show="searches.length">
    <ul>
      <li @click="selectItem(e)" class="search-item" v-for="(e,i) in searches" :key="i">
        <span class="text">{{e}}</span>
        <span class="icon" @click.stop="deleteOne(e)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      // 选择一个历史记录
      selectItem(item) {
        this.$emit('select', item)
      },
      // 删除一个历史记录
      deleteOne(item) {
        this.$emit('delete', item)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>