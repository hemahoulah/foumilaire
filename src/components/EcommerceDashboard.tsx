import React, { useState } from 'react';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  salesCount: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface OrderItem {
  id: string;
  customerName: string;
  email: string;
  total: number;
  itemCount: number;
  date: string;
  paymentMethod: string;
  status: 'En préparation' | 'Expédiée' | 'Livrée' | 'En attente';
}

interface EcommerceDashboardProps {
  onLogout: () => void;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'PRD-001',
    name: 'Montre Chronographe Automatique Titane',
    category: 'Horlogerie',
    price: 490.0,
    stock: 18,
    sku: 'HOR-TIT-902',
    salesCount: 64,
    status: 'in_stock',
  },
  {
    id: 'PRD-002',
    name: 'Sac de Voyage Cuir Végétal Havane',
    category: 'Maroquinerie',
    price: 320.0,
    stock: 7,
    sku: 'MAR-VOY-410',
    salesCount: 42,
    status: 'low_stock',
  },
  {
    id: 'PRD-003',
    name: 'Casque Audio Sans Fil Réduction de Bruit',
    category: 'High-Tech',
    price: 249.0,
    stock: 34,
    sku: 'AUD-ANC-808',
    salesCount: 112,
    status: 'in_stock',
  },
  {
    id: 'PRD-004',
    name: 'Eau de Parfum Santal & Cèdre Noir (100ml)',
    category: 'Parfumerie',
    price: 135.0,
    stock: 3,
    sku: 'PAR-SAN-100',
    salesCount: 89,
    status: 'low_stock',
  },
  {
    id: 'PRD-005',
    name: 'Porte-Cartes Minimaliste Aluminium & Cuir',
    category: 'Accessoires',
    price: 59.0,
    stock: 0,
    sku: 'ACC-WAL-005',
    salesCount: 204,
    status: 'out_of_stock',
  },
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'CMD-8492',
    customerName: 'Claire Delacroix',
    email: 'c.delacroix@outlook.fr',
    total: 490.0,
    itemCount: 1,
    date: 'Aujourd hui, 11:42',
    paymentMethod: 'Carte Bancaire (3D Secure)',
    status: 'En préparation',
  },
  {
    id: 'CMD-8491',
    customerName: 'Thomas Mercier',
    email: 't.mercier@orange.fr',
    total: 384.0,
    itemCount: 2,
    date: 'Aujourd hui, 10:15',
    paymentMethod: 'Apple Pay',
    status: 'Expédiée',
  },
  {
    id: 'CMD-8490',
    customerName: 'Sophie Bernard',
    email: 'sophie.bernard@gmail.com',
    total: 135.0,
    itemCount: 1,
    date: 'Aujourd hui, 09:28',
    paymentMethod: 'Carte Bancaire',
    status: 'Expédiée',
  },
  {
    id: 'CMD-8489',
    customerName: 'Karim Mansouri',
    email: 'k.mansouri@enterprise.fr',
    total: 739.0,
    itemCount: 3,
    date: 'Hier, 18:50',
    paymentMethod: 'Virement Instantané',
    status: 'Livrée',
  },
  {
    id: 'CMD-8488',
    customerName: 'Élodie Fontaine',
    email: 'elodie.f@proton.me',
    total: 249.0,
    itemCount: 1,
    date: 'Hier, 16:34',
    paymentMethod: 'Apple Pay',
    status: 'Livrée',
  },
];

export const EcommerceDashboard: React.FC<EcommerceDashboardProps> = ({ onLogout }) => {
  const [activeSubTab, setActiveSubTab] = useState<'apercu' | 'commandes' | 'produits'>('apercu');
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New product form fields
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Horlogerie');
  const [newProdPrice, setNewProdPrice] = useState('180');
  const [newProdStock, setNewProdStock] = useState('15');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    triggerToast(`Commande ${orderId} mise à jour : ${nextStatus}`);
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStock = Math.max(0, p.stock + delta);
          return {
            ...p,
            stock: nextStock,
            status: nextStock === 0 ? 'out_of_stock' : nextStock <= 5 ? 'low_stock' : 'in_stock',
          };
        }
        return p;
      })
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const priceNum = parseFloat(newProdPrice) || 99.0;
    const stockNum = parseInt(newProdStock, 10) || 10;

    const newProd: ProductItem = {
      id: `PRD-00${products.length + 1}`,
      name: newProdName,
      category: newProdCategory,
      price: priceNum,
      stock: stockNum,
      sku: `${newProdCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      salesCount: 0,
      status: stockNum === 0 ? 'out_of_stock' : stockNum <= 5 ? 'low_stock' : 'in_stock',
    };

    setProducts((prev) => [newProd, ...prev]);
    setShowAddProductModal(false);
    setNewProdName('');
    triggerToast(`Produit ajouté au catalogue : ${newProd.name}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-gutter-sm lg:px-gutter py-space-md flex flex-col gap-space-md">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-16 right-6 z-50 bg-surface border border-primary text-on-surface px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-mono animate-bounce">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Welcome & Store Status Bar */}
      <div className="relative bg-surface rounded-xl shadow-md border border-outline-variant/60 p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm overflow-hidden">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[26px]">storefront</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                Console Marchande E-Commerce
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Boutique Active en Ligne
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Connecté en tant que <strong className="text-on-surface">Administrateur Boutique</strong> · Paiements Stripe & CB opérationnels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-sm w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-space-xs md:pt-0 border-outline-variant/40">
          <button
            type="button"
            onClick={() => setShowAddProductModal(true)}
            className="px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
            <span>Nouveau Produit</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        {/* KPI 1 */}
        <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Chiffre d'Affaires</span>
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          </div>
          <div className="mt-space-xs">
            <span className="font-headline-lg text-headline-lg font-bold font-mono text-on-surface tabular-nums">
              {totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-label-sm text-tertiary font-semibold mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+18.4% ce mois</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Commandes du Jour</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">shopping_bag</span>
          </div>
          <div className="mt-space-xs">
            <span className="font-headline-lg text-headline-lg font-bold font-mono text-on-surface tabular-nums">
              {orders.length}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-label-sm text-primary font-semibold mt-1">
              <span>{orders.filter((o) => o.status === 'En préparation').length} à préparer</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Panier Moyen</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">receipt</span>
          </div>
          <div className="mt-space-xs">
            <span className="font-headline-lg text-headline-lg font-bold font-mono text-on-surface tabular-nums">
              {(totalRevenue / orders.length).toFixed(2)} €
            </span>
            <div className="flex items-center gap-1 text-[11px] font-label-sm text-tertiary font-semibold mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+4.2% vs semaine passée</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Références Stock</span>
            <span className="material-symbols-outlined text-outline text-[20px]">inventory_2</span>
          </div>
          <div className="mt-space-xs">
            <span className="font-headline-lg text-headline-lg font-bold font-mono text-on-surface tabular-nums">
              {products.length} articles
            </span>
            <div className="flex items-center gap-1 text-[11px] font-label-sm text-error font-semibold mt-1">
              <span>{products.filter((p) => p.status === 'low_stock').length} alertes stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('apercu')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'apercu'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Aperçu des Ventes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('commandes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'commandes'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
          <span>Commandes ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('produits')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'produits'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">category</span>
          <span>Catalogue & Stocks ({products.length})</span>
        </button>
      </div>

      {/* VIEW 1: APERÇU (Overview & Quick Cards) */}
      {activeSubTab === 'apercu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          {/* Recent Orders Overview */}
          <div className="lg:col-span-2 bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                Flux des Commandes Récentes
              </h2>
              <button
                type="button"
                onClick={() => setActiveSubTab('commandes')}
                className="text-primary hover:text-primary-fixed text-xs font-semibold cursor-pointer"
              >
                Voir tout ({orders.length}) →
              </button>
            </div>

            <div className="divide-y divide-outline-variant/30">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-mono text-xs font-bold">
                      {order.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-on-surface">{order.customerName}</span>
                        <span className="font-mono text-[10px] text-outline">{order.id}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">{order.date} · {order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-on-surface tabular-nums">
                      {order.total.toFixed(2)} €
                    </span>
                    <span
                      className={`text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded-full ${
                        order.status === 'Livrée'
                          ? 'bg-tertiary-container text-on-tertiary-container'
                          : order.status === 'Expédiée'
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts & Fast Action */}
          <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">warning</span>
              Alertes Réapprovisionnement
            </h2>
            <p className="text-xs text-on-surface-variant">
              Articles dont le niveau de stock requiert une commande fournisseur urgente.
            </p>

            <div className="flex flex-col gap-2 mt-1">
              {products
                .filter((p) => p.stock <= 7)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-on-surface">{prod.name}</span>
                      <span className="font-mono text-[10px] text-outline">SKU: {prod.sku}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold ${prod.stock === 0 ? 'text-error' : 'text-amber-600'}`}>
                        {prod.stock === 0 ? 'Rupture' : `${prod.stock} restant(s)`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(prod.id, 10)}
                        className="px-2 py-1 rounded bg-white hover:bg-slate-50 border border-outline-variant text-[11px] font-medium cursor-pointer shadow-xs"
                        title="Commander +10 unités"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-auto pt-2 border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ orders, products }, null, 2));
                  const dlAnchor = document.createElement('a');
                  dlAnchor.setAttribute('href', dataStr);
                  dlAnchor.setAttribute('download', `export-ecommerce-${Date.now()}.json`);
                  document.body.appendChild(dlAnchor);
                  dlAnchor.click();
                  dlAnchor.remove();
                  triggerToast('Export JSON généré.');
                }}
                className="w-full py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Exporter le rapport commercial (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMMANDES (Order Management) */}
      {activeSubTab === 'commandes' && (
        <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart_checkout</span>
                Gestion des Commandes Clients
              </h2>
              <p className="text-xs text-on-surface-variant">
                Suivi des règlements, bordereaux de livraison et expéditions Colissimo/DHL.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/60">
              {['all', 'En préparation', 'Expédiée', 'Livrée'].map((statusKey) => (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => setOrderFilter(statusKey)}
                  className={`px-2.5 py-1 text-xs rounded transition-all cursor-pointer font-medium ${
                    orderFilter === statusKey
                      ? 'bg-white text-primary shadow-xs font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {statusKey === 'all' ? 'Toutes' : statusKey}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher par nom de client, référence ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-label-md text-xs pl-9 pr-4 py-2 rounded-lg border border-outline-variant outline-none focus:border-primary"
            />
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-outline-variant/60 rounded-lg">
            <table className="w-full text-left font-label-md text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/60 text-outline">
                  <th className="p-3 font-semibold">Référence</th>
                  <th className="p-3 font-semibold">Client</th>
                  <th className="p-3 font-semibold">Articles</th>
                  <th className="p-3 font-semibold">Total TTC</th>
                  <th className="p-3 font-semibold">Moyen de Paiement</th>
                  <th className="p-3 font-semibold">Statut</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-primary font-mono">{ord.id}</td>
                    <td className="p-3">
                      <div className="font-semibold">{ord.customerName}</div>
                      <div className="text-[10px] text-outline font-sans">{ord.email}</div>
                    </td>
                    <td className="p-3 font-mono">{ord.itemCount} article(s)</td>
                    <td className="p-3 font-bold font-mono tabular-nums">{ord.total.toFixed(2)} €</td>
                    <td className="p-3 text-on-surface-variant">{ord.paymentMethod}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded-full ${
                          ord.status === 'Livrée'
                            ? 'bg-tertiary-container text-on-tertiary-container'
                            : ord.status === 'Expédiée'
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ord.status === 'En préparation' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Expédiée')}
                          className="px-2 py-1 rounded bg-primary text-white hover:bg-primary-fixed text-[11px] font-medium cursor-pointer shadow-xs"
                        >
                          Expédier
                        </button>
                      )}
                      {ord.status === 'Expédiée' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Livrée')}
                          className="px-2 py-1 rounded bg-tertiary text-white hover:opacity-90 text-[11px] font-medium cursor-pointer shadow-xs"
                        >
                          Marquer Livrée
                        </button>
                      )}
                      {ord.status === 'Livrée' && (
                        <span className="text-[11px] text-tertiary font-semibold flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          Terminée
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PRODUITS & STOCKS */}
      {activeSubTab === 'produits' && (
        <div className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                Catalogue & Inventaire Marchand
              </h2>
              <p className="text-xs text-on-surface-variant">
                Gestion des prix de vente, références SKU et ajustement des quantités en stock.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs w-fit"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Ajouter une Référence</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-surface border border-outline-variant/60 rounded-xl p-space-md flex flex-col justify-between gap-space-sm hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-label-sm uppercase font-semibold text-outline">
                      {prod.category}
                    </span>
                    <span
                      className={`text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded-full ${
                        prod.status === 'in_stock'
                          ? 'bg-tertiary-container text-on-tertiary-container'
                          : prod.status === 'low_stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prod.status === 'in_stock'
                        ? 'En stock'
                        : prod.status === 'low_stock'
                        ? 'Stock faible'
                        : 'Épuisé'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-on-surface leading-tight mt-0.5">
                    {prod.name}
                  </h3>
                  <span className="font-mono text-[11px] text-outline">SKU : {prod.sku}</span>
                </div>

                <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-outline block">Prix Unitaire</span>
                    <span className="font-bold font-mono text-sm text-primary">
                      {prod.price.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(prod.id, -1)}
                      className="w-7 h-7 rounded bg-surface-container-high hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                      title="Diminuer stock"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs w-8 text-center tabular-nums">
                      {prod.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(prod.id, 1)}
                      className="w-7 h-7 rounded bg-surface-container-high hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                      title="Augmenter stock"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Ajouter un Produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-gutter-sm">
          <div className="bg-surface border border-outline-variant rounded-xl p-space-lg max-w-md w-full shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-space-xs">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Ajouter un Produit au Catalogue
              </span>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-space-xs text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface" htmlFor="pname">Nom du produit :</label>
                <input
                  id="pname"
                  type="text"
                  required
                  placeholder="Ex: Sac à dos technique imperméable"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-label-md p-2 rounded border border-outline-variant outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface" htmlFor="pcat">Catégorie :</label>
                <select
                  id="pcat"
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-label-md p-2 rounded border border-outline-variant outline-none focus:border-primary"
                >
                  <option value="Horlogerie">Horlogerie</option>
                  <option value="Maroquinerie">Maroquinerie</option>
                  <option value="High-Tech">High-Tech</option>
                  <option value="Parfumerie">Parfumerie</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface" htmlFor="pprice">Prix (€ TTC) :</label>
                  <input
                    id="pprice"
                    type="number"
                    step="0.1"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="bg-surface-container-low text-on-surface font-label-md p-2 rounded border border-outline-variant outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface" htmlFor="pstock">Quantité initiale :</label>
                  <input
                    id="pstock"
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="bg-surface-container-low text-on-surface font-label-md p-2 rounded border border-outline-variant outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-space-sm pt-space-xs mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-space-md py-2 rounded bg-surface-container-high text-on-surface cursor-pointer hover:bg-surface-container-highest"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-space-md py-2 rounded bg-primary text-on-primary font-medium cursor-pointer hover:bg-primary-fixed shadow-sm"
                >
                  Créer la référence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
