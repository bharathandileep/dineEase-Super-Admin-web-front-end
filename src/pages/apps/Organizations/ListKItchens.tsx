import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner, Form } from "react-bootstrap";
import { getAllKitches } from "../../../server/admin/kitchens";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { toast } from "react-toastify";

interface Kitchen {
  _id: string;
  kitchen_name: string;
  kitchen_owner_name: string;
  kitchen_type: string;
  kitchen_phone_number: string;
  kitchen_image: string;
  addresses: { street_address: string; city: string; country: string }[];
  owner_email: string;
  kitchen_status: string;
}

function ListKitchens() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const fetchKitchens = async (
    currentPage: number,
    isNewSearch: boolean = false,
    searchQuery: string = ""
  ) => {
    if (isLoadingRef.current) return;

    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    isLoadingRef.current = true;

    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery,
      };

      const response = await getAllKitches(params);
      if (response.status) {
        const { kitchens, totalPages, totalKitchens } = response.data;

        if (isNewSearch) {
          setKitchens(kitchens);
        } else {
          setKitchens((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = kitchens.filter(
              (item: any) => !existingIds.has(item._id)
            );
            return [...prev, ...newItems];
          });
        }

        setTotalItems(totalKitchens);
        setHasMore(currentPage < totalPages);
        setPage(currentPage + 1);
      } else {
        toast.error("Failed to load kitchens.");
      }
    } catch (error) {
      console.error("Error fetching kitchens:", error);
      toast.error("An error occurred while fetching kitchens.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchKitchens(1, true, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchKitchens(page, false, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, searchTerm]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/list" },
          { label: "List", path: "/apps/kitchen/list", active: true },
        ]}
        title={"Kitchens"}
      />

      <div
        className='mb-3'
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='page-title m-0' style={{ color: "#fff" }}>
            Kitchens
          </h3>
          <Link
            to='/apps/kitchen/new'
            className='btn btn-danger waves-effect waves-light'
          >
            <i className='mdi mdi-plus-circle me-1'></i> Add New Kitchen
          </Link>
        </div>
      </div>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row className='justify-content-between'>
                <Col className='col-auto'>
                  <form className='d-flex align-items-center'>
                    <label htmlFor='inputPassword2' className='visually-hidden'>
                      Search
                    </label>
                    <div>
                      <input
                        type='search'
                        className='form-control my-1 my-lg-0'
                        id='inputPassword2'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {loading ? (
        <div className='text-center my-5'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
          <p className='mt-2'>Loading kitchens...</p>
        </div>
      ) : (
        <Row>
          {kitchens.length > 0 ? (
            kitchens.map((item) => (
              <Col key={item._id} md={6} xl={3} className='mb-3'>
                <Link to={`/apps/kitchen/details/${item._id}`}>
                  <Card className='product-box h-100 shadow-sm'>
                    <Card.Body className='d-flex flex-column'>
                      <div className='bg-light mb-1'>
                        <img
                          src={
                            item.kitchen_image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.kitchen_name}
                          className='img-fluid'
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className='product-info mt-auto'>
                        <h5 className='font-24 mt-0 sp-line-1 bold'>
                          {item.kitchen_name}
                        </h5>
                        <div className='text-muted font-14'>
                          <div className='d-flex align-items-center mb-1 text-black'>
                            <i className='mdi mdi-map-marker me-1'></i>
                            <span>
                              {item.addresses[0]?.street_address},{" "}
                              {item.addresses[0]?.city},{" "}
                              {item.addresses[0]?.country}
                            </span>
                          </div>
                          <div className='d-flex align-items-center mb-1 text-black'>
                            <i className='mdi mdi-phone-classic me-1'></i>
                            <span>{item.kitchen_phone_number}</span>
                          </div>
                          <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-email me-1'></i>
                            <span>{item.owner_email}</span>
                          </div>
                          <div className='d-flex align-items-center text-black'>
                            <i className='mdi mdi-home-variant me-1'></i>
                            <span>{item.kitchen_type}</span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col>
              <Card>
                <Card.Body className='text-center'>
                    className='mdi mdi-alert-circle-outline text-muted'
                                    <i
  style={{ fontSize: "48px" }}
                  ></i>
                  <h4 className='mt-3'>No Kitchens Found</h4>
                  <p className='text-muted'>
                    {searchTerm
                      ? `No kitchens match your search criteria "${searchTerm}".`
                      : "There are no kitchens in the system yet."}
                  </p>
                  <Button
                    variant='primary'
                    onClick={() => navigate("/apps/kitchen/new")}
                  >
                    Add New Kitchen
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {loadingMore && (
        <div className='text-center my-4'>
          <Spinner animation='border' size='sm' /> Loading more...
        </div>
      )}
    </>
  );
}

export default ListKitchens;
