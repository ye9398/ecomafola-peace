import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TrackOrderPage from '../pages/TrackOrderPage'
import AccountOrdersPage from '../pages/AccountOrdersPage'
import { useAuth } from '../context/AuthContext'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

// Mock customerAccount
vi.mock('../lib/customerAccount', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getCurrentCustomer: vi.fn(),
  }
})

// Mock navigate - 需要在测试前定义
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// 辅助函数：渲染带路由的组件
function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Order Tracking System', () => {
  describe('TrackOrderPage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockFetch.mockReset()
    })

    it('renders TrackOrderPage correctly', () => {
      renderWithRouter(<TrackOrderPage />)

      expect(screen.getByText('订单追踪')).toBeInTheDocument()
      expect(screen.getByText('输入订单号和下单邮箱查询订单状态')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('#1001')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '查询订单' })).toBeInTheDocument()

      // 检查标签存在（不关联）
      expect(screen.getByText('订单号')).toBeInTheDocument()
      expect(screen.getByText('下单邮箱')).toBeInTheDocument()
    })

    it('shows error when order is not found', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: {
            orders: {
              nodes: []
            }
          }
        })
      })

      renderWithRouter(<TrackOrderPage />)

      const orderInput = screen.getByPlaceholderText('#1001')
      const emailInput = screen.getByPlaceholderText('your@email.com')
      const submitButton = screen.getByRole('button', { name: '查询订单' })

      fireEvent.change(orderInput, { target: { value: 'EM-2024-001' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.submit(submitButton)

      await waitFor(() => {
        expect(screen.getByText('未找到订单，请检查订单号和邮箱')).toBeInTheDocument()
      })
    })

    it('shows error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      renderWithRouter(<TrackOrderPage />)

      const orderInput = screen.getByPlaceholderText('#1001')
      const emailInput = screen.getByPlaceholderText('your@email.com')
      const submitButton = screen.getByRole('button', { name: '查询订单' })

      fireEvent.change(orderInput, { target: { value: 'EM-2024-001' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.submit(submitButton)

      await waitFor(() => {
        expect(screen.getByText('网络错误，请稍后重试')).toBeInTheDocument()
      })
    })

    it('displays order details successfully', async () => {
      const mockOrderData = {
        data: {
          orders: {
            nodes: [{
              orderNumber: 'EM-2024-001',
              processedAt: '2024-01-15T10:30:00Z',
              financialStatus: 'paid',
              fulfillmentStatus: 'fulfilled',
              statusUrl: 'https://ecomafola.com/orders/123/status',
              lineItems: {
                nodes: [
                  {
                    title: 'Coconut Bowl Set',
                    quantity: 2,
                    originalTotalPrice: {
                      amount: '59.98',
                      currencyCode: 'USD'
                    }
                  }
                ]
              },
              fulfillments: [{
                trackingInfo: [{
                  number: '1Z999AA10123456784',
                  url: 'https://tracking.example.com/1Z999AA10123456784',
                  company: 'UPS'
                }]
              }]
            }]
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        json: async () => mockOrderData
      })

      renderWithRouter(<TrackOrderPage />)

      const orderInput = screen.getByPlaceholderText('#1001')
      const emailInput = screen.getByPlaceholderText('your@email.com')
      const submitButton = screen.getByRole('button', { name: '查询订单' })

      fireEvent.change(orderInput, { target: { value: 'EM-2024-001' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.submit(submitButton)

      await waitFor(() => {
        expect(screen.getByText('订单 #EM-2024-001')).toBeInTheDocument()
      })

      expect(screen.getByText('已付款')).toBeInTheDocument()
      expect(screen.getByText('Coconut Bowl Set')).toBeInTheDocument()
      expect(screen.getByText('数量：2')).toBeInTheDocument()
      expect(screen.getByText('UPS')).toBeInTheDocument()
      expect(screen.getByText('1Z999AA10123456784')).toBeInTheDocument()
    })

    it('shows loading state during query', async () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}))

      renderWithRouter(<TrackOrderPage />)

      const orderInput = screen.getByPlaceholderText('#1001')
      const emailInput = screen.getByPlaceholderText('your@email.com')
      const submitButton = screen.getByRole('button', { name: '查询订单' })

      fireEvent.change(orderInput, { target: { value: 'EM-2024-001' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('查询中...')).toBeInTheDocument()
      })
    })

    it('form validation requires order number', async () => {
      renderWithRouter(<TrackOrderPage />)

      const emailInput = screen.getByPlaceholderText('your@email.com')
      const submitButton = screen.getByRole('button', { name: '查询订单' })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      // HTML5 validation should prevent submission
      await waitFor(() => {
        expect(screen.getByPlaceholderText('#1001')).toBeRequired()
      })
    })

    it('form validation requires email', async () => {
      renderWithRouter(<TrackOrderPage />)

      const orderInput = screen.getByPlaceholderText('#1001')
      const submitButton = screen.getByRole('button', { name: '查询订单' })

      fireEvent.change(orderInput, { target: { value: 'EM-2024-001' } })
      fireEvent.click(submitButton)

      // HTML5 validation should prevent submission
      await waitFor(() => {
        expect(screen.getByPlaceholderText('your@email.com')).toBeRequired()
      })
    })
  })

  describe('AccountOrdersPage', () => {
    const mockUseAuth = vi.mocked(useAuth)
    let getCurrentCustomerMock: ReturnType<typeof vi.fn>

    beforeEach(async () => {
      vi.clearAllMocks()
      mockNavigate.mockClear()
      const { getCurrentCustomer } = await import('../lib/customerAccount')
      getCurrentCustomerMock = vi.mocked(getCurrentCustomer)
    })

    it('redirects to login when not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      })

      // 当用户未登录时，getCurrentCustomer 应该返回 null
      getCurrentCustomerMock.mockResolvedValue(null as any)

      renderWithRouter(<AccountOrdersPage />)

      // 组件应该调用 navigate 到登录页
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })

    it('renders orders list successfully', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com', name: 'Test User', country: 'US' },
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      })

      const mockCustomer = {
        id: 'gid://shopify/Customer/123',
        displayName: 'Test User',
        emailAddress: { emailAddress: 'test@example.com' },
        orders: {
          nodes: [
            {
              id: 'gid://shopify/Order/456',
              number: 'EM-2024-001',
              processedAt: '2024-01-15T10:30:00Z',
              fulfillmentStatus: 'fulfilled',
              financialStatus: 'paid',
              statusUrl: 'https://ecomafola.com/orders/456/status',
              lineItems: {
                nodes: [
                  {
                    title: 'Coconut Bowl Set',
                    quantity: 2,
                    price: {
                      amount: '59.98',
                      currencyCode: 'USD',
                    },
                  },
                ],
              },
              fulfillments: [
                {
                  trackingInfo: [
                    {
                      number: '1Z999AA10123456784',
                      url: 'https://tracking.example.com',
                      company: 'UPS',
                    },
                  ],
                },
              ],
            },
          ],
        },
      }

      getCurrentCustomerMock.mockResolvedValue(mockCustomer as any)

      renderWithRouter(<AccountOrdersPage />)

      await waitFor(() => {
        expect(screen.getByText('My Orders')).toBeInTheDocument()
      })

      expect(screen.getByText('Welcome, Test User (test@example.com)')).toBeInTheDocument()
      expect(screen.getByText('Order #EM-2024-001')).toBeInTheDocument()
      expect(screen.getByText('Coconut Bowl Set')).toBeInTheDocument()
      expect(screen.getByText('Qty: 2')).toBeInTheDocument()
      expect(screen.getByText('Paid')).toBeInTheDocument()
    })

    it('shows empty state when no orders', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com', name: 'Test User', country: 'US' },
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      })

      const mockCustomer = {
        id: 'gid://shopify/Customer/123',
        displayName: 'Test User',
        emailAddress: { emailAddress: 'test@example.com' },
        orders: {
          nodes: [],
        },
      }

      getCurrentCustomerMock.mockResolvedValue(mockCustomer as any)

      renderWithRouter(<AccountOrdersPage />)

      await waitFor(() => {
        expect(screen.getByText('No orders yet')).toBeInTheDocument()
      })

      expect(screen.getByText('Start Shopping →')).toBeInTheDocument()
    })

    it('handles loading state', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com', name: 'Test User', country: 'US' },
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      })

      getCurrentCustomerMock.mockImplementation(() => new Promise(() => {}))

      renderWithRouter(<AccountOrdersPage />)

      expect(screen.getByText('加载中...')).toBeInTheDocument()
    })
  })
})
