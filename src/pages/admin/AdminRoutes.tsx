import { Routes, Route } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminPage from './AdminPage'
import ProductContentAdmin from './ProductContentAdmin'
import HomeContentAdmin from './HomeContentAdmin'

/**
 * 管理后台独立路由组件
 *
 * 设计原则：
 * - 完全独立，不影响现有前台功能
 * - 只编辑补充内容（品牌故事、产品详情描述等）
 * - 不修改 Shopify 核心数据（价格、库存、SKU）
 * - 数据存储在独立的 JSON 文件
 *
 * 访问方式：
 * - 登录页：https://ecomafola.com/admin/login
 * - 管理面板：https://ecomafola.com/admin
 * - 产品编辑：https://ecomafola.com/admin/products
 * - 主页编辑：https://ecomafola.com/admin/homepage
 *
 * 登录凭证：
 * - 用户名：admin
 * - 密码：admin9396
 */
// 此文件已不再使用，路由直接定义在 App.tsx 中
// 保留此文件以防万一需要回退到旧配置
export default function AdminRoutes() {
  return null
}
