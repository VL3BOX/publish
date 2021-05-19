<template>
    <div class="m-publish-joke-emotion">
        <div>
            <template v-for="emotion in sortedEmotions">
                <span :key="emotion.key" class="emotion-item" @click="handleEmotionClick(emotion.key)">
                    <img :src="emotion.path" :alt="emotion.key" :title="emotion.key">
                </span>
            </template>
        </div>
    </div>
</template>

<script>
import emotion from '@/assets/data/emotion.json'
import { __imgPath } from '@jx3box/jx3box-common/data/jx3box.json'
export default {
  name: 'joke_emotion',
  data: () => ({
      sortedEmotions: []
  }),
  created() {
    this.emotionSort()
  },
  computed: {

  },
  methods: {
    // 表情排序
    emotionSort() {
        const keys = Object.keys(emotion)
        keys.sort((item1, item2) => {
            return item1.localeCompare(item2)
        })
        keys.forEach(key => {
            const obj = {
                key,
                value: emotion[key],
                path: __imgPath + `image/emotion/${key}.gif`
            }
            this.sortedEmotions.push(obj)
        })
    },
    /**
     * 点击表情触发事件
     * @param {string} key 表情key
     */
    handleEmotionClick(key) {
        this.$emit('select', `#${key}`)
    }
  }
}
</script>

<style lang="less" scoped>
.m-publish-joke-emotion {
    margin: 16px 0;

    .emotion-item {
        display: inline-flex;
        padding: 4px;
        margin: 2px;
        border: 1px solid #fff;

        &:hover {
            border-color: #ccc;
        }
    }
}
</style>