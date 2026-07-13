import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Book, Camera, Loader2, Wand2 } from 'lucide-react';
import apiFetch from '../../../services/api';
import BarcodeScannerComponent from './BarcodeScannerComponent';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', barcode: '', rack_location: '', publisher: '', language: '', edition: '', price: '', purchase_date: '', vendor_details: '', category_id: '', quantity: 1
    });

    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');

    const [showScanner, setShowScanner] = useState(false);
    const [isFetchingISBN, setIsFetchingISBN] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [booksRes, catRes] = await Promise.all([
                apiFetch('/librarian/books', { headers: { Authorization: `Bearer ${token}` } }),
                apiFetch('/librarian/categories', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            const booksData = await booksRes.json();
            const catData = await catRes.json();
            
            if (booksData.success) setBooks(booksData.data);
            if (catData.success) setCategories(catData.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingBook(null);
        setFormData({ title: '', author: '', isbn: '', barcode: '', rack_location: '', publisher: '', language: '', edition: '', price: '', purchase_date: '', vendor_details: '', category_id: '', quantity: 1 });
        setIsModalOpen(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title || '', author: book.author || '', isbn: book.isbn || '', 
            barcode: book.barcode || '', rack_location: book.rack_location || '', 
            publisher: book.publisher || '', language: book.language || '', 
            edition: book.edition || '', price: book.price || '', 
            purchase_date: book.purchase_date ? book.purchase_date.split('T')[0] : '', 
            vendor_details: book.vendor_details || '', 
            category_id: book.category_id || '', quantity: book.quantity || 1
        });
        setIsModalOpen(true);
    };

    const fetchBookByISBN = async (isbnVal) => {
        if(!isbnVal) return;
        setIsFetchingISBN(true);
        try {
            // Using OpenLibrary API for free ISBN lookup
            const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnVal}&format=json&jscmd=data`);
            const data = await res.json();
            const bookData = data[`ISBN:${isbnVal}`];
            
            if (bookData) {
                const authors = bookData.authors ? bookData.authors.map(a => a.name).join(', ') : '';
                const publishers = bookData.publishers ? bookData.publishers.map(p => p.name).join(', ') : '';
                
                setFormData(prev => ({
                    ...prev,
                    isbn: isbnVal,
                    title: bookData.title || prev.title,
                    author: authors || prev.author,
                    publisher: publishers || prev.publisher,
                    barcode: isbnVal // Often they use ISBN as barcode if they don't have custom ones
                }));
            } else {
                alert(`No details found for ISBN: ${isbnVal}`);
            }
        } catch (err) {
            console.error("Error fetching ISBN details", err);
            alert("Network error while fetching ISBN details.");
        } finally {
            setIsFetchingISBN(false);
        }
    };

    const handleCameraScan = (decodedText) => {
        setShowScanner(false);
        fetchBookByISBN(decodedText);
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingBook ? `/librarian/books/${editingBook.id}` : '/librarian/books';
            const method = editingBook ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
                setIsModalOpen(false);
            } else {
                alert(data.message || 'Error saving book');
            }
        } catch (err) {
            alert('Server error');
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch(`/librarian/books/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
            } else {
                alert(data.message || 'Error deleting book');
            }
        } catch (err) {
            alert('Server error');
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: categoryName, description: categoryDesc })
            });
            const data = await res.json();
            if (data.success) {
                setCategoryName('');
                setCategoryDesc('');
                setIsCategoryModalOpen(false);
                fetchData();
            } else {
                alert(data.message || 'Error saving category');
            }
        } catch (err) {
            alert('Server error');
        }
    };

    const filteredBooks = books.filter(b => 
        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm";
    const labelCls = "block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider";

    return (
        <div className="animate-fade-in space-y-6">
            {showScanner && (
                <BarcodeScannerComponent 
                    title="Scan Book ISBN"
                    onScan={handleCameraScan} 
                    onClose={() => setShowScanner(false)} 
                />
            )}

            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                        <Book size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 m-0">Book Management</h2>
                        <p className="text-sm text-slate-500 m-0">Manage library inventory, add books, and organize categories</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold shadow-sm">
                        <Plus size={16} /> Add Category
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-semibold shadow-sm shadow-slate-300">
                        <Plus size={16} /> Add New Book
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by title, author, barcode..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 text-sm"
                        />
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                        Total Books: {books.length}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-200">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Book Details</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading inventory...</td></tr>
                            ) : filteredBooks.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No books found matching your search.</td></tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800 text-sm m-0">{book.title}</p>
                                            <p className="text-xs text-slate-500 m-0 mt-1">Author: {book.author}</p>
                                            <p className="text-xs text-slate-400 m-0">Barcode: {book.barcode || 'N/A'}</p>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {book.category_name || '-'}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-semibold text-slate-800 m-0">{book.available} <span className="text-slate-500 font-normal">/ {book.quantity}</span></p>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            Rack: {book.rack_location || '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                book.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                                book.status === 'Issued' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(book)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteBook(book.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Book Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 m-0">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {!editingBook && (
                            <div className="px-6 pt-4 pb-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowScanner(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white font-bold rounded-xl shadow-sm hover:bg-slate-900 transition-all active:scale-[0.98]"
                                >
                                    {isFetchingISBN ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                                    {isFetchingISBN ? 'Fetching Book Details...' : 'Smart Auto-Fill (Scan ISBN)'}
                                    {!isFetchingISBN && <Wand2 size={16} className="ml-1 opacity-70" />}
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Or enter details manually below</p>
                            </div>
                        )}

                        <div className="p-6 overflow-y-auto">
                            <form id="bookForm" onSubmit={handleBookSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className={labelCls}>Book Title *</label><input required type="text" name="title" value={formData.title} onChange={handleInputChange} className={inputCls} placeholder="Enter title" /></div>
                                    <div><label className={labelCls}>Author *</label><input required type="text" name="author" value={formData.author} onChange={handleInputChange} className={inputCls} placeholder="Enter author" /></div>
                                    <div><label className={labelCls}>Category</label>
                                        <select name="category_id" value={formData.category_id} onChange={handleInputChange} className={inputCls}>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div><label className={labelCls}>Barcode / ID *</label><input required type="text" name="barcode" value={formData.barcode} onChange={handleInputChange} className={inputCls} placeholder="Scan or enter barcode" /></div>
                                    <div>
                                        <label className={labelCls}>ISBN Number</label>
                                        <div className="relative">
                                            <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} className={inputCls + " pr-20"} placeholder="ISBN number" />
                                            <button 
                                                type="button" 
                                                onClick={() => fetchBookByISBN(formData.isbn)}
                                                disabled={isFetchingISBN || !formData.isbn}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200 disabled:opacity-50"
                                            >
                                                Fetch
                                            </button>
                                        </div>
                                    </div>
                                    <div><label className={labelCls}>Rack / Shelf Location</label><input type="text" name="rack_location" value={formData.rack_location} onChange={handleInputChange} className={inputCls} placeholder="e.g. A1-R4" /></div>
                                    <div><label className={labelCls}>Publisher</label><input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} className={inputCls} placeholder="Publisher" /></div>
                                    <div><label className={labelCls}>Language</label><input type="text" name="language" value={formData.language} onChange={handleInputChange} className={inputCls} placeholder="e.g. English, Hindi" /></div>
                                    <div><label className={labelCls}>Edition</label><input type="text" name="edition" value={formData.edition} onChange={handleInputChange} className={inputCls} placeholder="e.g. 1st Edition" /></div>
                                    <div><label className={labelCls}>Price (₹)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} className={inputCls} placeholder="0.00" /></div>
                                    <div><label className={labelCls}>Purchase Date</label><input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleInputChange} className={inputCls} /></div>
                                    <div><label className={labelCls}>Total Quantity *</label><input required type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} className={inputCls} /></div>
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" form="bookForm" className="px-5 py-2.5 text-sm font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-colors shadow-sm">{editingBook ? 'Save Changes' : 'Add Book'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 m-0">Add Category</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form id="categoryForm" onSubmit={handleCategorySubmit} className="space-y-4">
                                <div><label className={labelCls}>Category Name *</label><input required type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className={inputCls} placeholder="e.g. Science Fiction" /></div>
                                <div><label className={labelCls}>Description</label><textarea value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} className={inputCls} rows="3" placeholder="Optional description"></textarea></div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                            <button onClick={() => setIsCategoryModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" form="categoryForm" className="px-5 py-2 text-sm font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-colors shadow-sm">Save Category</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookManagement;
