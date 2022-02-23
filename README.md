# Silk

一个 Vue3 脚手架

首先它肯定是基于 `vue3` + `ts` + `vite`的

然后它集成了自己使用到的一些实用的库和插件。

如：[tailwindcss](https://tailwindcss.com/)、[vue-router4](https://next.router.vuejs.org/index.html)、[vueuse](https://vueuse.org/)、[pinia](https://pinia.vuejs.org/)几个实用的工具。

以及让开发变得更丝滑的插件：[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)、[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)、[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)。

## 使用

```
// clone项目
npx degit kaiser-9527/silk.git

// 安装依赖并运行 (推荐使用pnpm)
pnpm i & pnpm run dev
```

## 功能

### 告别手写 CSS

集成 tailwindcss，不需要手写样式，拿来即用，专注于 HTML 的编写。有 vscode 插件的加持，智能提示类名，如虎添翼。

当然也可以用 windicss，windicss 的出现是为了更好的性能和更快的速度。但是这在 Tailwindcss 出了`jit`模式之后，变得没那么有优势了。基于 Tailwindcss 的 3.x 以及更好的生态，所以选择了 Tailwindcss。

### 可能是未来的 vuex 的样子

pinia 实现了 vuex5 的提案。简化了写法，非常方便的 TS 支持，以及非常符合`setup script`风格。

```ts
// 定义store
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'kaiser'
  }),
  actions: {
    updateName(name) {
      this.name = name
    }
  }
})
```

```vue
<template>
  <section>
    {{ userStore.name }}
    <button @click="userStore.updateName">update</button>
  </section>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
</script>
```

### Vue 超实用 hooks

`vueuse`  是一个基于  `Composition API`  的实用函数集合，类似以 lodash，他是一个方法合集，但是是响应式的，也就是 vue3 的 hooks，当然他也兼容 vue2。里面提供了非常多好玩的 hooks，值得一试，少写很多轮子。

下面的例子，移动鼠标，`x` `y`的值会实时变化：

```
<template>
  <div>pos: {{x}}, {{y}}</div>
</template>

<script setup lang="ts">
const { x, y } = useMouse()
</script>
```

### 类 Nextjs 的文件系统路由

`Nextjs`的基于文件系统的路由是非常方便和实用的。于是就有了`vite-plugin-pages`。
默认情况下，你写在`src/pages`下的`.vue` `.js`文件就是一个页面组件。

如：

- `src/pages/users.vue` -> `/users`
- `src/pages/users/profile.vue` -> `/users/profile`
- `src/pages/settings.vue` -> `/settings`

只需要在创建路由的时候引入就好：

```
import { createRouter } from "vue-router";
import routes from "~pages";

const router = createRouter({
  // ...
  routes,
});
```

`~pages`就是根据`src/pages`下的文件生成的路由规则。具体的规则可以查看[这里](https://github.com/hannoeru/vite-plugin-pages#file-system-routing)

### 强大的 unplugin

重头戏来了，基于强大的统一插件构建系统[unplugin](https://github.com/unjs/unplugin)，大佬们封装了三个非常实用的支持 vite 的插件，让开发体验更加丝滑。

#### unplugin-auto-import

自动引入，少些一大堆的`import`，尤其是在一个复杂的组件里面，经常会引入很多资源。有了这个插件，你可以省事很多。

你不需要：

```ts
import { ref, computed } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

你只需要：

```ts
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

不仅仅是 vue3 api，它还提供了很多其他库的预设，你只需要在`vite.confit.ts`配置即可。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1430bce62db14077bbe86badaf33fde7~tplv-k3u1fbpfcp-watermark.image?)

```typescript
AutoImport({
  // targets to transform
  include: [
    /.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /.vue$/,
    /.vue?vue/, // .vue
    /.md$/ // .md
  ],

  // global imports to register
  imports: ['vue', 'vue-router', 'vueuse-core'],

  // custom resolvers
  // see https://github.com/antfu/unplugin-auto-import/pull/23/
  resolvers: [
    /* ... */
  ]
})
```

在配置项里面的`import`选项可以填入上面截图的预设项。上面的代码配置了`vue` `vue-router` `vueuse`，那么你就可以打代码里任性的使用这三者的 API，而不需要手动 import。

最重要的是，你可以配置自己的工具库，或者其他第三方框架等，非常灵活。

#### unplugin-vue-components

还是 unplugin 的封装，这次是组件，组件不需要引入，直接在`template`里面写就完事了。

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>
```

当然这个`HelloWord.vue`必须存在在`src/components/`下面。

插件会解析你的`template`，遇到组件写法，就默认去`src/components/`下面找，你也可以配置其他的路径甚至多个路径。

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      dirs: ['src/packages']
    })
  ]
})
```

如果只是自动引入自定义组件，那还是不够，因为我们可能在项目中用到其他第三方组件，如`Element` `naive-ui`等。所以该插件也提供了大部分第三方 Vue 组件的预设。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61d0540f403145528e956916eb0c2d83~tplv-k3u1fbpfcp-watermark.image?)

```ts
// vite.config.js
import ViteComponents, { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// your plugin installation
Components({
  resolvers: [ElementPlusResolver()]
})
```

配置了`ElementPlus`之后，你就可以在文件里面直接使用而不需要手动引入：

```vue
<template>
  <el-button>HI</el-button>
</template>
```
