'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import { validateLicensePlate } from '@/utils/validation';
import { getUserId } from '@/utils/user';
import { ViolationResponse, ViolationData } from '@/types/api';
import { API_STATUS } from '@/config/api';

interface SearchHistoryItem {
  id: number;
  plateNumber: string;
  hasResults: boolean;
  createdAt: string;
}

export default function Home() {
  const [plateNumber, setPlateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViolationResponse | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        setLoadingHistory(false);
        return;
      }

      setLoadingHistory(true);
      const response = await fetch(`/api/history?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      
      if (data.status === API_STATUS.SUCCESS && Array.isArray(data.data)) {
        setSearchHistory(data.data);
      } else {
        console.error('Invalid history response:', data);
        setSearchHistory([]);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
      setSearchHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setValidationError(null);
    setResult(null);
    setSearchPerformed(false);
    setLastUpdated(null);
    
    const userId = getUserId();
    if (!userId) {
      toast.error('Không thể xác định người dùng');
      return;
    }

    const validation = validateLicensePlate(plateNumber);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Biển số không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      // Format license plate exactly as original
      const formattedPlateNumber = plateNumber.replace(/[\s\-\.]/g, '').toUpperCase();
      
      console.log('Submitting search for:', formattedPlateNumber);
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plateNumber: formattedPlateNumber,
          userId 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Search response:', data);
      
      if (data.status === API_STATUS.SUCCESS) {
        if (data.data?.length > 0) {
          setResult(data);
          setLastUpdated(data.lastUpdated);
        } else {
          setResult(null);
          toast.success('Không tìm thấy thông tin vi phạm');
        }
      } else {
        // Log the actual error response
        console.error('API Error:', {
          status: data.status,
          message: data.message,
          error: data.error
        });
        toast.error(data.message || 'Hệ thống đang nâng cấp, vui lòng thử lại sau');
        setResult(null);
      }

      // Always fetch search history after any search attempt
      await fetchSearchHistory();

    } catch (error) {
      console.error('Search Error:', error);
      toast.error('Hệ thống đang nâng cấp, vui lòng thử lại sau');
      setResult(null);
      // Still fetch history even if search failed
      await fetchSearchHistory();
    } finally {
      setSearchPerformed(true);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlateNumber(e.target.value);
    setValidationError(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <main className="min-vh-100 d-flex flex-column">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-bottom">
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-center">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="me-2" />
            <h1 className="fs-5 mb-0">Tra cứu vi phạm giao thông</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 py-4">
        <div className="container">
          {/* Search Form */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row align-items-end">
                  <div className="col">
                    <label htmlFor="plateNumber" className="form-label mb-2">Biển số xe</label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="plateNumber"
                        value={plateNumber}
                        onChange={handleInputChange}
                        className={`form-control ${validationError ? 'is-invalid' : ''}`}
                        placeholder="VD: 98A-289.11"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang tra cứu...
                          </>
                        ) : (
                          'Tra cứu'
                        )}
                      </button>
                      {validationError && (
                        <div className="invalid-feedback">
                          {validationError}
                        </div>
                      )}
                    </div>
                    <div className="form-text">
                      Định dạng hợp lệ: XXAB.XXXXX, XXA.XXXXX, XXABXXXXX, hoặc XXAXXXXX (X là số, A/B là chữ)
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Results */}
          {searchPerformed && (
            <div className="card mb-4">
              <div className="card-body">
                {result && result.status === API_STATUS.SUCCESS && result.data?.length > 0 ? (
                  <>
                    <h5 className="card-title mb-3">Kết quả tra cứu</h5>
                    
                    {lastUpdated && (
                      <div className="text-muted mb-3">
                        <small>Dữ liệu cập nhật vào lúc {lastUpdated}</small>
                      </div>
                    )}
                    
                    <div className="row g-3 mb-4">
                      <div className="col-sm-4">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2 text-muted">Tổng số vi phạm</h6>
                            <p className="card-text h4 text-primary">{result.data_info?.total || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2 text-muted">Đã xử phạt</h6>
                            <p className="card-text h4 text-success">{result.data_info?.daxuphat || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2 text-muted">Chưa xử phạt</h6>
                            <p className="card-text h4 text-warning">{result.data_info?.chuaxuphat || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {result.data.map((violation: ViolationData, index: number) => (
                      <div key={index} className="card mb-3">
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-3">
                              <strong>Biển số:</strong> {violation['Biển kiểm soát']}
                            </div>
                            <div className="col-md-3">
                              <strong>Loại xe:</strong> {violation['Loại phương tiện']}
                            </div>
                            <div className="col-md-3">
                              <strong>Màu biển:</strong> {violation['Mau biển']}
                            </div>
                            <div className="col-md-3">
                              <strong>Nền màu:</strong> {violation['Nền mầu']}
                            </div>
                          </div>

                          <div className="mb-2">
                            <strong>Thời gian vi phạm:</strong>
                            <div>{violation['Thời gian vi phạm']}</div>
                          </div>

                          <div className="mb-2">
                            <strong>Địa điểm vi phạm:</strong>
                            <div>{violation['Địa điểm vi phạm']}</div>
                          </div>

                          <div className="mb-2">
                            <strong>Hành vi vi phạm:</strong>
                            <div>{violation['Hành vi vi phạm']}</div>
                          </div>

                          <div className="mb-2">
                            <strong>Trạng thái:</strong>
                            <div>{violation['Trạng thái']}</div>
                          </div>

                          <div className="mb-2">
                            <strong>Đơn vị phát hiện vi phạm:</strong>
                            <div>{violation['Đơn vị phát hiện vi phạm']}</div>
                          </div>

                          <div>
                            <strong>Nơi giải quyết vụ việc:</strong>
                            <div>{Array.isArray(violation['Nơi giải quyết vụ việc']) 
                              ? violation['Nơi giải quyết vụ việc'].join(', ') 
                              : violation['Nơi giải quyết vụ việc']}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="alert alert-info mb-0" role="alert">
                    <h4 className="alert-heading">Không tìm thấy thông tin vi phạm!</h4>
                    <p className="mb-0">Không tìm thấy thông tin vi phạm giao thông cho biển số <strong>{plateNumber}</strong>.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search History */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Lịch sử tra cứu</h5>
              
              {loadingHistory ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : searchHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Biển số</th>
                        <th>Thời gian</th>
                        <th>Kết quả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchHistory.map((item) => (
                        <tr key={item.id}>
                          <td>{item.plateNumber}</td>
                          <td>{formatDate(item.createdAt)}</td>
                          <td>
                            {item.hasResults ? (
                              <span className="text-success">Có vi phạm</span>
                            ) : (
                              <span className="text-muted">Không có vi phạm</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  Chưa có lịch sử tra cứu nào
                </div>
              )}
            </div>
          </div>
       </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-muted border-top">
        <div className="container">
          <small> {new Date().getFullYear()} Tra cứu phạt nguội. All rights reserved.</small>
        </div>
      </footer>
    </main>
  );
}
