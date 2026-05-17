import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import productApi from '../api/productApi';
import userApi from '../api/userApi';

const emptyProductForm = {
  name: '',
  category: 'accessories',
  price: 199,
  originalPrice: 199,
  rating: 4.5,
  sku: '',
  image: '',
  isNew: false,
  onSale: false,
  tags: ['TechPro']
};

const formatMoney = (value) => Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const orderStatusOptions = ['Processing', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const userRoleOptions = ['Admin', 'Customer'];
const userStatusOptions = ['Active', 'Suspended'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  const dashboardStats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const activeOrders = orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled').length;
    return {
      revenue,
      activeOrders,
      productCount: products.length,
      alerts: products.filter(product => Number(product.price) <= 0).length,
      userCount: users.length
    };
  }, [orders, products, users]);

  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase();

    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesKeyword = !keyword || [
        order.orderNumber,
        order.customer?.fullName,
        order.customer?.email,
        order.customer?.phone
      ].some(value => String(value || '').toLowerCase().includes(keyword));

      return matchesStatus && matchesKeyword;
    });
  }, [orderSearch, orderStatusFilter, orders]);

  const filteredUsers = useMemo(() => {
    const keyword = userSearch.trim().toLowerCase();

    return users.filter(user => {
      const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
      const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
      const matchesKeyword = !keyword || [user.name, user.email].some(value => String(value || '').toLowerCase().includes(keyword));
      return matchesRole && matchesStatus && matchesKeyword;
    });
  }, [userRoleFilter, userSearch, userStatusFilter, users]);

  const loadAdminData = async () => {
    try {
      const [productData, orderData, userData] = await Promise.all([
        productApi.getAll(),
        orderApi.getAll(),
        userApi.getAll()
      ]);
      setProducts(productData);
      setOrders(orderData);
      setUsers(userData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingProductId(null);
  };

  const handleProductInput = (event) => {
    const { name, value, type, checked } = event.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      sku: product.sku,
      image: product.image,
      isNew: product.isNew,
      onSale: product.onSale,
      tags: product.tags || ['TechPro']
    });
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      rating: Number(productForm.rating),
      tags: Array.isArray(productForm.tags) ? productForm.tags : String(productForm.tags).split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const savedProduct = editingProductId
      ? await productApi.update(editingProductId, payload)
      : await productApi.create(payload);

    setProducts(prev => editingProductId
      ? prev.map(product => product.id === editingProductId ? savedProduct : product)
      : [savedProduct, ...prev]
    );
    setNotice(editingProductId ? 'Product updated.' : 'Product created.');
    resetProductForm();
  };

  const handleDeleteProduct = async (id) => {
    await productApi.remove(id);
    setProducts(prev => prev.filter(product => product.id !== id));
    if (editingProductId === id) resetProductForm();
    setNotice('Product deleted.');
  };

  const handleOrderStatusChange = async (orderNumber, status) => {
    const updatedOrder = await orderApi.updateStatus(orderNumber, status);
    setOrders(prev => prev.map(order => order.orderNumber === orderNumber ? updatedOrder : order));
    setSelectedOrder(prev => prev?.orderNumber === orderNumber ? updatedOrder : prev);
    setNotice(`Order ${orderNumber} moved to ${updatedOrder.status}.`);
  };

  const handleUserUpdate = async (user, changes) => {
    const updatedUser = await userApi.update(user.id, { ...user, ...changes });
    setUsers(prev => prev.map(item => item.id === user.id ? updatedUser : item));
    setNotice(`User ${updatedUser.email} updated.`);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md stagger-children">
              <div className="glass p-md rounded-xl border border-primary/20 flex flex-col gap-sm relative overflow-hidden hover-lift">
                <div className="absolute -right-4 -top-4 text-primary/10">
                  <span className="material-symbols-outlined text-[100px]">attach_money</span>
                </div>
                <span className="font-label-md text-on-surface-variant uppercase tracking-wider relative z-10">Total Revenue</span>
                <span className="font-headline-lg font-bold text-primary text-glow relative z-10">{formatMoney(dashboardStats.revenue)}</span>
                <span className="font-label-sm text-[#00E5FF] flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">trending_up</span> Live order revenue</span>
              </div>
              <div className="glass p-md rounded-xl border border-outline-variant/30 flex flex-col gap-sm relative overflow-hidden hover-lift">
                <div className="absolute -right-4 -top-4 text-white/5">
                  <span className="material-symbols-outlined text-[100px]">shopping_cart</span>
                </div>
                <span className="font-label-md text-on-surface-variant uppercase tracking-wider relative z-10">Active Orders</span>
                <span className="font-headline-lg font-bold text-on-surface relative z-10">{dashboardStats.activeOrders}</span>
                <span className="font-label-sm text-[#00E5FF] flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">trending_up</span> In progress</span>
              </div>
              <div className="glass p-md rounded-xl border border-outline-variant/30 flex flex-col gap-sm relative overflow-hidden hover-lift">
                <div className="absolute -right-4 -top-4 text-white/5">
                  <span className="material-symbols-outlined text-[100px]">group</span>
                </div>
                <span className="font-label-md text-on-surface-variant uppercase tracking-wider relative z-10">Products</span>
                <span className="font-headline-lg font-bold text-on-surface relative z-10">{dashboardStats.productCount}</span>
                <span className="font-label-sm text-[#00E5FF] flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">inventory_2</span> Catalog items</span>
              </div>
              <div className="glass p-md rounded-xl border border-error/30 flex flex-col gap-sm relative overflow-hidden hover-lift bg-error/5">
                <div className="absolute -right-4 -top-4 text-error/10">
                  <span className="material-symbols-outlined text-[100px]">warning</span>
                </div>
                <span className="font-label-md text-error uppercase tracking-wider relative z-10">System Alerts</span>
                <span className="font-headline-lg font-bold text-error text-glow relative z-10">{dashboardStats.alerts}</span>
                <span className="font-label-sm text-error/80 flex items-center gap-1 relative z-10">Catalog validation alerts</span>
              </div>
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              <div className="lg:col-span-2 glass rounded-xl border border-outline-variant/30 p-lg fade-in-up">
                <h2 className="font-headline-sm mb-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">monitoring</span>
                  Network Traffic
                </h2>
                <div className="h-64 w-full bg-surface-container rounded-lg border border-outline-variant/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                  <span className="font-label-md text-on-surface-variant tracking-widest relative z-10">CHART VISUALIZATION.MODULE</span>
                </div>
              </div>
              
              <div className="glass rounded-xl border border-outline-variant/30 p-lg fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="font-headline-sm mb-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00E5FF]">sync</span>
                  Recent Operations
                </h2>
                <div className="flex flex-col gap-md">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-outline-variant/20 last:border-0 last:pb-0">
                      <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-[16px]">check_circle</span>
                      <div>
                        <p className="font-label-sm text-on-surface">Order #{9000 + i} processed</p>
                        <p className="font-label-sm text-on-surface-variant text-[10px] mt-0.5">{i * 2} minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'products':
        return (
          <div className="glass rounded-xl border border-outline-variant/30 p-lg fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md mb-md">
              <h2 className="font-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                Product Inventory
              </h2>
              <button onClick={resetProductForm} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-fixed transition-colors flex items-center gap-2 w-fit">
                <span className="material-symbols-outlined text-[18px]">add</span> New Product
              </button>
            </div>
            {notice && <div className="mb-md text-primary border border-primary/30 bg-primary/10 rounded-lg px-4 py-2 font-label-md">{notice}</div>}
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-4 gap-sm mb-lg bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
              <input name="name" value={productForm.name} onChange={handleProductInput} required placeholder="Product name" className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary" />
              <select name="category" value={productForm.category} onChange={handleProductInput} className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary">
                {['phones', 'laptops', 'tablets', 'audio', 'accessories', 'smarthome'].map(category => <option key={category}>{category}</option>)}
              </select>
              <input name="price" value={productForm.price} onChange={handleProductInput} min="1" type="number" placeholder="Price" className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary" />
              <input name="originalPrice" value={productForm.originalPrice} onChange={handleProductInput} min="1" type="number" placeholder="Original price" className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary" />
              <input name="rating" value={productForm.rating} onChange={handleProductInput} min="1" max="5" step="0.1" type="number" placeholder="Rating" className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary" />
              <input name="sku" value={productForm.sku} onChange={handleProductInput} placeholder="SKU" className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary" />
              <input name="image" value={productForm.image} onChange={handleProductInput} placeholder="Image URL" className="bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary md:col-span-2" />
              <label className="flex items-center gap-2 text-on-surface-variant font-label-md">
                <input name="isNew" checked={productForm.isNew} onChange={handleProductInput} type="checkbox" />
                New
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant font-label-md">
                <input name="onSale" checked={productForm.onSale} onChange={handleProductInput} type="checkbox" />
                Sale
              </label>
              <div className="md:col-span-2 flex gap-sm">
                <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-fixed transition-colors">
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
                {editingProductId && <button type="button" onClick={resetProductForm} className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md hover:border-primary hover:text-primary transition-colors">Cancel</button>}
              </div>
            </form>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4">Product ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="6" className="py-6 px-4 text-on-surface-variant">Loading products...</td></tr>
                  )}
                  {!loading && products.map(product => (
                    <tr key={product.id} className="border-b border-outline-variant/20 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4 font-mono text-primary text-[12px]">PRD-{product.id}</td>
                      <td className="py-3 px-4 font-body-md">{product.name}</td>
                      <td className="py-3 px-4 font-label-sm text-on-surface-variant">{product.category}</td>
                      <td className="py-3 px-4 font-body-md">{formatMoney(product.price)}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-1 rounded-full font-label-sm text-[10px] border border-[#00E5FF]/20">{product.rating}/5</span>
                      </td>
                      <td className="py-3 px-4 flex gap-sm">
                        <button onClick={() => handleEditProduct(product)} className="text-on-surface-variant group-hover:text-primary transition-colors" title="Edit"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                      </td>
                    </tr>
                  ))}
                  {!loading && products.length === 0 && (
                    <tr><td colSpan="6" className="py-6 px-4 text-on-surface-variant">No products available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="glass rounded-xl border border-outline-variant/30 p-lg fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
              <h2 className="font-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_cart</span>
                Order Control
              </h2>
              <button onClick={loadAdminData} className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md hover:border-primary hover:text-primary transition-colors flex items-center gap-2 w-fit">
                <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
              </button>
            </div>
            {notice && <div className="mb-md text-primary border border-primary/30 bg-primary/10 rounded-lg px-4 py-2 font-label-md">{notice}</div>}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-sm mb-md bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
              <label className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  value={orderSearch}
                  onChange={(event) => setOrderSearch(event.target.value)}
                  placeholder="Search order, customer, email, phone"
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-on-surface outline-none focus:border-primary"
                />
              </label>
              <select
                value={orderStatusFilter}
                onChange={(event) => setOrderStatusFilter(event.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary"
              >
                <option value="all">All statuses</option>
                {orderStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="7" className="py-6 px-4 text-on-surface-variant">Loading orders...</td></tr>
                  )}
                  {!loading && filteredOrders.map(order => (
                    <tr key={order.orderNumber} className="border-b border-outline-variant/20 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-primary text-[12px]">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-body-md">{order.customer?.fullName || 'Guest Customer'}</p>
                        <p className="font-label-sm text-on-surface-variant">{order.customer?.email}</p>
                      </td>
                      <td className="py-3 px-4 font-label-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4 font-body-md">{formatMoney(order.total)}</td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(event) => handleOrderStatusChange(order.orderNumber, event.target.value)}
                          className="bg-surface border border-primary/30 text-primary px-2 py-1 rounded-lg font-label-sm text-[12px] outline-none focus:border-primary"
                        >
                          {orderStatusOptions.map(status => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4 font-label-sm text-on-surface-variant">{order.items?.length || 0}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelectedOrder(order)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredOrders.length === 0 && (
                    <tr><td colSpan="7" className="py-6 px-4 text-on-surface-variant">No orders match the current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="glass rounded-xl border border-outline-variant/30 p-lg fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
              <h2 className="font-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">group</span>
                User Management
              </h2>
              <button onClick={loadAdminData} className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md hover:border-primary hover:text-primary transition-colors flex items-center gap-2 w-fit">
                <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
              </button>
            </div>
            {notice && <div className="mb-md text-primary border border-primary/30 bg-primary/10 rounded-lg px-4 py-2 font-label-md">{notice}</div>}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-sm mb-md bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
              <label className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search name or email"
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-on-surface outline-none focus:border-primary"
                />
              </label>
              <select value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)} className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary">
                <option value="all">All roles</option>
                {userRoleOptions.map(role => <option key={role}>{role}</option>)}
              </select>
              <select value={userStatusFilter} onChange={(event) => setUserStatusFilter(event.target.value)} className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary">
                <option value="all">All statuses</option>
                {userStatusOptions.map(status => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="5" className="py-6 px-4 text-on-surface-variant">Loading users...</td></tr>
                  )}
                  {!loading && filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-outline-variant/20 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-body-md text-on-surface">{user.name}</p>
                        <p className="font-label-sm text-on-surface-variant">{user.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(event) => handleUserUpdate(user, { role: event.target.value })}
                          className="bg-surface border border-primary/30 text-primary px-2 py-1 rounded-lg font-label-sm text-[12px] outline-none focus:border-primary"
                        >
                          {userRoleOptions.map(role => <option key={role}>{role}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.status}
                          onChange={(event) => handleUserUpdate(user, { status: event.target.value })}
                          className="bg-surface border border-outline-variant text-on-surface px-2 py-1 rounded-lg font-label-sm text-[12px] outline-none focus:border-primary"
                        >
                          {userStatusOptions.map(status => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4 font-label-sm text-on-surface-variant">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-label-sm text-on-surface-variant">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</td>
                    </tr>
                  ))}
                  {!loading && filteredUsers.length === 0 && (
                    <tr><td colSpan="5" className="py-6 px-4 text-on-surface-variant">No users match the current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex w-full min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline-variant/30 flex flex-col hidden lg:flex">
        <div className="p-lg border-b border-outline-variant/30 flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[28px]">shield_person</span>
          <span className="font-headline-sm font-bold text-primary tracking-widest">ADMIN.OS</span>
        </div>
        <nav className="flex-1 py-md flex flex-col gap-xs px-sm">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'}`}>
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${activeTab === 'products' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'}`}>
            <span className="material-symbols-outlined">inventory_2</span> Products
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${activeTab === 'orders' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'}`}>
            <span className="material-symbols-outlined">shopping_cart</span> Orders
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${activeTab === 'users' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'}`}>
            <span className="material-symbols-outlined">group</span> Users
          </button>
        </nav>
        <div className="p-md border-t border-outline-variant/30">
          <Link className="flex items-center gap-sm px-md py-sm rounded-lg text-error hover:bg-error/10 transition-colors" to="/">
            <span className="material-symbols-outlined">logout</span> Exit System
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto page-enter custom-scrollbar">
        <header className="h-20 bg-surface/80 backdrop-blur border-b border-outline-variant/30 flex items-center justify-between px-lg sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <h1 className="font-headline-md font-bold">System Dashboard</h1>
          </div>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
            <div className="flex items-center gap-sm pl-md border-l border-outline-variant/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold font-label-md">A</div>
              <span className="font-label-md hidden sm:block">Admin.Root</span>
            </div>
          </div>
        </header>

        <div className="p-lg lg:p-xl flex flex-col gap-xl">
          {renderContent()}
        </div>
      </main>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-md">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-surface border border-outline-variant/40 rounded-xl shadow-2xl">
            <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-outline-variant/30 p-md flex items-center justify-between gap-md">
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Order Detail</p>
                <h2 className="font-headline-sm text-primary">{selectedOrder.orderNumber}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors" title="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-lg grid grid-cols-1 lg:grid-cols-3 gap-lg">
              <div className="lg:col-span-2 flex flex-col gap-md">
                <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                  <div className="px-md py-3 border-b border-outline-variant/30 flex items-center justify-between gap-md">
                    <h3 className="font-title-md">Items</h3>
                    <span className="font-label-sm text-on-surface-variant">{selectedOrder.items?.length || 0} line items</span>
                  </div>
                  <div className="divide-y divide-outline-variant/20">
                    {(selectedOrder.items || []).map(item => (
                      <div key={`${item.id}-${item.name}`} className="p-md grid grid-cols-[56px_1fr_auto] gap-md items-center">
                        <img src={item.image || 'https://placehold.co/120x120/222/FFF?text=TP'} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-outline-variant/30" />
                        <div>
                          <p className="font-body-md text-on-surface">{item.name}</p>
                          <p className="font-label-sm text-on-surface-variant">{item.category || 'catalog'} {item.storage ? `- ${item.storage}` : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-body-md">{formatMoney(item.price)}</p>
                          <p className="font-label-sm text-on-surface-variant">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-md">
                  <h3 className="font-title-md mb-sm">Shipping Address</h3>
                  <p className="font-body-md text-on-surface">{selectedOrder.customer?.address}</p>
                  <p className="font-label-sm text-on-surface-variant">
                    {[selectedOrder.customer?.ward, selectedOrder.customer?.district, selectedOrder.customer?.city].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-md">
                <div className="border border-outline-variant/30 rounded-xl p-md">
                  <h3 className="font-title-md mb-sm">Customer</h3>
                  <p className="font-body-md">{selectedOrder.customer?.fullName || 'Guest Customer'}</p>
                  <p className="font-label-sm text-on-surface-variant">{selectedOrder.customer?.email}</p>
                  <p className="font-label-sm text-on-surface-variant">{selectedOrder.customer?.phone}</p>
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-md">
                  <h3 className="font-title-md mb-sm">Fulfillment</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(event) => handleOrderStatusChange(selectedOrder.orderNumber, event.target.value)}
                    className="w-full bg-surface border border-primary/30 text-primary px-3 py-2 rounded-lg font-label-md outline-none focus:border-primary mb-sm"
                  >
                    {orderStatusOptions.map(status => <option key={status}>{status}</option>)}
                  </select>
                  <p className="font-label-sm text-on-surface-variant">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="font-label-sm text-on-surface-variant mt-1">Payment: {selectedOrder.paymentMethod}</p>
                  <p className="font-label-sm text-on-surface-variant">Shipping: {selectedOrder.shippingMethod}</p>
                </div>

                <div className="border border-outline-variant/30 rounded-xl p-md">
                  <h3 className="font-title-md mb-sm">Totals</h3>
                  <div className="flex justify-between font-label-md text-on-surface-variant py-1">
                    <span>Subtotal</span>
                    <span>{formatMoney(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-label-md text-on-surface-variant py-1">
                    <span>Shipping</span>
                    <span>{formatMoney(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-label-md text-on-surface-variant py-1">
                    <span>Discount</span>
                    <span>-{formatMoney(selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between font-title-md text-primary border-t border-outline-variant/30 mt-sm pt-sm">
                    <span>Total</span>
                    <span>{formatMoney(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
