import "./App.css";
import "./chat.css";
import "./responsive.css"
import image from "./img/bot-icon.png";
import bot_avatar from "./img/bot-avatar.png";
import human_avatar from "./img/human-avatar.png";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
// import $ from 'jquery';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';


function App() {
  const [scrolled, setScrolled] = useState(false);
  const [backToTopActive, setBackToTopActive] = useState(false);
  const chatInputRef = useRef(null);

  const [queryResponse, setQueryResponse] = useState([
    { query: "", response: "Welcome to the P.P.T Travels & Tours. How can I help you today?" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [queries, setQueries] = useState([]);
  // const [selectedQuery, setSelectedQuery] = useState("");
  // const [loadingMessage, setLoadingMessage] = useState(false);


  //for show success message
  function showSuccessMessage(message) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }

  //for show error message
  function showErrorMessage(message) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }

  const initialCredentials = {
    fullName: "",
    email: "",
    phoneNo: "",
    message: "",
  }

  const [credentials, setCredentials] = useState(initialCredentials);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "phoneNo" && value.length === 11) {
      return;
    }

    setCredentials({ ...credentials, [name]: value });
  }

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const sendMessage = async (messageDetail) => {
    try {
      const response = await axios.post('http://localhost:8000/api/query/contact', messageDetail, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data;

      if (!result.error) {
        console.log(result);
        showSuccessMessage("Your message is recieved.One of our agent will contact you shortly")
        setCredentials(initialCredentials);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(credentials);

    sendMessage(credentials);
  };

  /////
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    function animateNumber(element, targetNumber) {
      let currentNumber = 0;
      const increment = Math.ceil(targetNumber / 100);
      const animationDuration = 4000;

      const updateNumber = () => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
          currentNumber = targetNumber;
          clearInterval(interval);
        }
        element.textContent = `${(currentNumber / 1).toFixed()}+`;
      };

      const interval = setInterval(updateNumber, animationDuration / 100);
    }

    function handleIntersection(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = document.querySelectorAll('.achievment-count');
          numbers.forEach(numberElement => {
            const targetNumber = parseInt(numberElement.getAttribute('data-target'));
            animateNumber(numberElement, targetNumber);
          });
          observer.unobserve(entry.target);
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    });

    const section = document.querySelector('.achievment-area');
    observer.observe(section);
  }, []);

  useEffect(() => {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        setBackToTopActive(true);
      } else {
        setBackToTopActive(false);
      }
    };

    window.addEventListener('load', toggleBacktotop);
    window.addEventListener('scroll', toggleBacktotop);

    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.transition = 'opacity 0.8s';
        preloader.style.opacity = 0;
        setTimeout(() => preloader.remove(), 800);
      }, 800);
    }

    return () => {
      window.removeEventListener('load', toggleBacktotop);
      window.removeEventListener('scroll', toggleBacktotop);
    };
  }, []);

  useEffect(() => {
    const handleChatKeyDown = (event) => {
      if (event.ctrlKey && event.key === '/' && chatInputRef.current) {
        chatInputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleChatKeyDown);
    return () => {
      document.removeEventListener('keydown', handleChatKeyDown);
    };
  }, []);
  /////

  const fetchResponseForQuery = async (query) => {
    let message;
    if (query) {
      message = {
        dbquery: query
      }
    } else {
      message = {
        query: userMessage
      }
    }
    // setLoadingMessage(true);
    setQueryResponse([...queryResponse, {
      query: (query ? query : userMessage), response:
        <div className="loading-chat">
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
        </div>
    }]);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/api/query/find-matching-response`, message);
      console.log(response.data);
      setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: response.data.response }]);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data.error);
      setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: "Error, Something went wrong...." }]);
    } finally {
      setUserMessage("");
      // setSelectedQuery("");
      setQueries([]);
      // setLoadingMessage(false);
    }
  }

  const handleChange = async (e) => {

    setUserMessage(e.target.value);
    setErrorMessage("");

    const queryString = { queryString: e.target.value }
    if (e.target.value && e.target.value !== " ") {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASEURL}/api/query/find-out-matching-queries`, queryString);
        console.log(response.data);
        setQueries(response.data);
      } catch (err) {
        console.log(err);
        setQueries([]);
      }
    }
  }

  return (
    <>
      <div className="loader-area" id="preloader">
        <span class="loader"></span>
      </div>

      {/* heder section */}
      <header className={`header-area overflow-hidden ${scrolled ? 'scrolled' : ''}`}>
        <nav>
          <div className="container">
            <div className="nav-section">
              <a href="#top" onClick={(e) => handleNavClick(e, 'top')} className="logo-link">
                <img src="../logo.png" className="nav-logo" alt="" />
                <span>P.P.T</span> Travels & Tours
              </a>
              <ul className="nav-link-area">
                <li>
                  <a href="#about" onClick={(e) => handleNavClick(e, 'about')}
                    className="nav-link">About</a>
                </li>
                <li>
                  <a href="#chat" onClick={(e) => handleNavClick(e, 'chat')}
                    className="nav-link">Chat</a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleNavClick(e, 'services')}
                    className="nav-link">Services</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}
                    className="nav-link">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {/*  */}

      {/* hero section */}
      <section className="section-padding hero-section overflow-hidden init-section" id="top">
        <div className="container-fluid">
          <div className="hero-container">
            <div className="container">
              <div className="row">
                <div className="col-12 col-xl-10 col-xxl-9">
                  <h2 className="hero-title" data-aos="fade-down">Welcome to  <br /><span>P.P.T <span>Travels & Tours</span></span></h2>
                  <h4 className="hero-sub-title mt-3" data-aos="fade-left">Discover the Ultimate Luxury Travel Experience</h4>
                  <p className="hero-desc mt-4" data-aos="fade-up">
                    Embark on a journey like no other with Sri Lanka's premier luxury bus service. Whether you're a local or a foreign traveler, our top-notch fleet, exceptional service, and extensive network of routes ensure that your travel experience is nothing short of extraordinary. Book your adventure with P.P.T Travels & Tours today and travel the way you deserve.
                  </p>

                  <p className="hero-desc paragraph-2 mt-3" data-aos="fade-up" data-aos-delay="200">
                    At P.P.T Travels & Tours, we prioritize your comfort and convenience. With years of experience and a fleet of state-of-the-art buses, we set the standard for luxury travel in Sri Lanka. Explore new destinations, enjoy seamless bookings, and experience unparalleled service with the renowned PPT Express. Start your unforgettable journey with us now.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  */}

      {/* about section */}
      <section className="section-padding overflow-hidden position-relative" id="about">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xxl-6 col-xl-6">
              <div className="about-us-container w-100 pe-xl-5">
                <h6 className="section-label" data-aos="fade-left">About us</h6>
                <h3 className="section-heading mb-4 mb-xxl-5" data-aos="zoom-out">Journey with P.P.T</h3>
                <p className="section-para mt-4" data-aos="fade">
                  PPT Travels and tours, a renowned name in the travel industry of Sri Lanka is a specialized bus service that provides many travel opportunities to both local and foreign travelers. Known as the PPT express by its many customers in Sri Lanka, we at PPT travels has been leading the way for many years and setting standards along the way for Bus services all around the country.
                </p>

                <p className="section-para" data-aos="fade">
                  PPT bus service is truly exquisite in terms of comfort and convenience where we provide exciting travel packages, transport facilities and offer bus services from Colombo to many different regions in Sri Lanka at affordable price. Daily PPT express bus service from Colombo to Jaffna has taken special notice by our customers for its ease that is met with luxury and affordability.
                </p>
              </div>
            </div>
            <div className="col-12 col-xxl-6 col-xl-6">
              <img src="../bus.png" className="about-img" data-aos="zoom-in-left" data-aos-duration="1500" alt="" />
            </div>
          </div>
        </div>
      </section>
      {/*  */}

      {/* achievements section */}
      <section className="section-padding achievment-section bg-gray position-relative overflow-hidden" data-aos="fade-right">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="achievment-area text-center mb-5 text-lg-start mb-sm-5 mb-lg-0">
                <h1 className="achievment-count" data-target="55">0</h1>
                <h6 className="achievment">Buses in Fleet</h6>
              </div>
            </div>

            <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="achievment-area text-center mb-5 text-lg-start mb-sm-5 mb-lg-0">
                <h1 className="achievment-count" data-target="25">0</h1>
                <h6 className="achievment">Years of Service</h6>
              </div>
            </div>

            <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="achievment-area text-center mb-5 mb-sm-0 text-lg-start">
                <h1 className="achievment-count" data-target="150">0</h1>
                <h6 className="achievment">Destinations Covered</h6>
              </div>
            </div>

            <div className="col-12 col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="achievment-area text-center text-lg-start">
                <h1 className="achievment-count" data-target="50">0</h1>
                <h6 className="achievment">Daily Departures</h6>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  */}

      {/* chat section */}
      <section className="section-padding chat-section position-relative overflow-hidden" id="chat">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-7 col-lg-6">
              <div className="about-us-container w-100 pe-xl-5">
                <h6 className="section-label" data-aos="fade-left">Chat</h6>
                <h3 className="section-heading mb-4 mb-xxl-5" data-aos="zoom-out">
                  Instant Assistance with Our ChatBot
                </h3>
                <p className="section-para mt-4" data-aos="fade">
                  Welcome to the future of travel assistance with P.P.T Travels & Tours' advanced ChatBot. Designed to provide you with seamless support, our ChatBot is available 24/7 to help you with all your travel needs. Whether you're checking bookings, confirming vehicle departure times, verifying seat availability, or exploring the luxurious features of our fleet, our ChatBot makes it easy and efficient.
                </p>

                <p className="section-para" data-aos="fade">
                  Need to make last-minute changes to your travel itinerary? Our ChatBot can handle that. Want to know more about our services and routes? Just ask. With real-time updates and instant responses, our ChatBot ensures that you have all the information you need at your fingertips.
                </p>

                <p className="section-para" data-aos="fade">
                  At P.P.T Travels & Tours, we understand the importance of a smooth travel experience. Our ChatBot is here to simplify the process, offering you the convenience of instant assistance from the comfort of your device. Start chatting now to experience the ease and efficiency of our state-of-the-art travel support system. Your journey to comfort and luxury begins with a simple chat.
                </p>

                <div className="goto-link-btn-area" data-aos="fade-up">
                  <h6>To check availability and more details visit :</h6>
                  <a href="https://www.ppttravel.com/" className="btn go-to-link-btn" target="_blank" rel="noreferrer">
                    ppttravel.com
                    <i class="bi bi-arrow-up-right ms-2"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-5 col-lg-6 col-md-10 mx-md-auto">
              <div className="card chat--card right" id={`${window.innerWidth <= 991 ? 'chat_window' : ''}`} data-aos="fade-up" data-aos-duration="1500">

                {errorMessage && (
                  <div class="alert alert-danger alert-dismissible chat-alert-msg fade show" role="alert">
                    {errorMessage}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" onClick={() => setErrorMessage('')} aria-label="Close"></button>
                  </div>
                )}

                <div className="card-header chatting-card-header">
                  <div className="chat-header-image-area">
                    <img src={image} alt="Bot Icon" className="chatting-person-image" />
                  </div>
                  <div className="chatting-person-name">
                    Chat Assistant <br />
                    <span>P.P.T<span>Travels & Tours</span></span>
                  </div>
                </div>

                <ScrollToBottom className="card-body chatting-card-body">
                  {queryResponse.length > 0 &&
                    queryResponse.map((qr, index) => {
                      return (
                        <>
                          {qr.query && (
                            <div className="chat--message-container send"
                              key={index}>
                              <div className="chat--message-area">
                                <div className="chat-message-content">
                                  <p>{qr?.query}</p>
                                </div>
                              </div>
                              <img src={human_avatar} alt="Human Avatar" className='chat-avatar' />
                            </div>
                          )}

                          {qr.response &&
                            <div className="chat--message-container receive"
                              key={index}>
                              <div className="chat--message-area">
                                <div className="chat-message-content">
                                  <p dangerouslySetInnerHTML={{ __html: qr?.response }}/>
                                </div>
                              </div>
                              <img src={bot_avatar} alt="Bot Avatar"
                                className='chat-avatar' />
                            </div>
                          }
                        </>

                      );
                    })}
                </ScrollToBottom>

                <div className="card-footer chatting-card-footer">
                  <div className="chat-input-group">
                    <textarea type="search"
                      value={userMessage}
                      className='form-control message-input'
                      placeholder='Enter the message here...'
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && userMessage.trim() !== '') {
                          fetchResponseForQuery();
                        } else if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      ref={chatInputRef}
                      autoFocus
                    ></textarea>

                    <button className='btn msg-send-btn' disabled={userMessage.trim() === ""}
                      onClick={() => fetchResponseForQuery()}>
                      <i class="bi bi-send"></i>
                    </button>

                    <div className="chat-short-cut">
                      <span className="chat-short-cut-key">Ctrl + /</span>
                    </div>

                    {queries.length > 0 && userMessage && (
                      <div className="seach-dropdown-area">
                        {queries.map((query, index) => {
                          return (
                            <div
                              className="seach-dropdown-data"
                              key={index}
                              onClick={() => {
                                setQueries([]);
                                fetchResponseForQuery(query)
                              }}
                            >
                              {query}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  */}

      {/* services section */}
      <div className="container-fluid overflow-hidden">
        <section className="section-padding services-section" id="services">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="services-container w-100">
                  <h6 className="section-center-label" data-aos="fade-down">Services</h6>
                  <h3 className="section-heading with-shadow text-center mb-4 mb-xxl-5" data-aos="zoom-out">
                    Comprehensive Travel Services by P.P.T Travels & Tours
                  </h3>
                  <p className="section-para mt-4 text-gray text-align-last-center" data-aos="fade">
                    At P.P.T Travels & Tours, we are dedicated to providing a full spectrum of top-notch services to fulfill all your travel and transport requirements. Our diverse range of offerings ensures that every aspect of your journey is covered with professionalism, reliability, and a commitment to excellence.
                  </p>

                  <p className="section-para text-gray text-align-last-center" data-aos="fade">
                    Explore the comprehensive suite of services we offer at P.P.T Travels & Tours. Each service is designed to provide you with a seamless, enjoyable, and memorable travel experience. We are here to ensure that every detail of your journey is handled with the utmost care and precision, so you can travel with confidence and peace of mind. Let P.P.T Travels & Tours be your trusted partner in all your travel and transport endeavors.Here’s an in-depth look at what we provide:
                  </p>
                </div>
              </div>

              <div className="col-12">
                <div className="service-content-container">
                  <div className="row service-content-area">
                    <div className="col-12 col-xl-6 col-lg-6 col-md-6" data-aos="fade-up">
                      <article className="service-content-article mb-4">
                        <h6 className="service-title">PPT Express</h6>
                        <p className="service-desc">
                          As one of the finest travel agents, we at PPT express provide our expert bus booking services giving excellent opportunities to travel all over Sri Lanka while saving both your time and money. We use new busses that carries comfort along with many other facilities make your travel experience with us as memorable as possible. PPT travels daily bus between Colombo and Jaffna is a turning point to all travelers as we offer a pleasurable and luxurious 9- hour ride. PPT Bus bookings are famous and sought after due to its promise and deliverance of services.
                        </p>
                      </article>
                    </div>

                    <div className="col-12 col-xl-6 col-lg-6 col-md-6" data-aos="fade-up">
                      <article className="service-content-article mb-4">
                        <h6 className="service-title">Transport</h6>
                        <p className="service-desc">
                          If you are looking to move or in need of an efficient transport service that is cost effective and reliable then you are in luck because PPT express also specialize in providing transport and moving services to any of your requests. It doesn’t matter whether it’s residential or commercial, local or long distance because if you hire us we will be literally going to any distance to meet your requirements in the most reasonable and cost effective manner.
                        </p>
                      </article>
                    </div>

                    <div className="col-12 col-xl-6 col-lg-6 col-md-6" data-aos="fade-up">
                      <article className="service-content-article mb-4 mb-md-0">
                        <h6 className="service-title">Air Ticketing</h6>
                        <p className="service-desc">
                          Think of us for your next travel by air as we are experts in handling both domestic and international flight bookings. PPT ticket bookings will give you the best offers for the most reasonable rates. Through our years of experience and the business relationships we have built, we can arrange cheaper airfare for our customers saving a lot of money.
                        </p>
                      </article>
                    </div>

                    <div className="col-12 col-xl-6 col-lg-6 col-md-6" data-aos="fade-up">
                      <article className="service-content-article mb-4 mb-md-0">
                        <h6 className="service-title">MLocal & International Courier Service.</h6>
                        <p className="service-desc">
                          Think of us for your next travel by air as we are experts in handling both domestic and international flight bookings. PPT ticket bookings will give you the best offers for the most reasonable rates. Through our years of experience and the business relationships we have built, we can arrange cheaper airfare for our customers saving a lot of money.
                        </p>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/*  */}

      {/* contact section */}
      <section className="section-padding contact-section overflow-hidden" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-6 col-lg-5">
              <div className="contact-content-container">
                <h6 className="section-label" data-aos="fade-left">Contact</h6>
                <h3 className="section-heading mb-4 mb-xxl-5" data-aos="zoom-out">
                  Get in Touch with P.P.T Travels & Tours
                </h3>

                <p className="section-para mb-4" data-aos="fade">
                  At P.P.T Travels & Tours, we value your inquiries and are committed to providing you with the best possible service. Whether you have questions about our services, need assistance with bookings.
                </p>

                <div className="contact-content mb-3 mb-xl-4" data-aos="fade-up">
                  <div className="contact-icon-area">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <a href="mailto:info@ppttravel.com" className="contact-link">
                    info@ppttravel.com
                  </a>
                </div>

                <div className="contact-sub-area" data-aos="fade-up">
                  <h5 className="contact-title mb-3">Our Branches</h5>

                  <div className="contact-sub-content mb-3">
                    <h6 className="contact-sub-title mb-4">Central Road, Colombo :</h6>
                    <div className="contact-sub-link-area">
                      <i class="bi bi-telephone-fill"></i>
                      <div className="contact-sub-link w-100">
                        <a href="tel:+94764408951">+94 76 440 8951</a>,&nbsp;
                        <a href="tel:+94766036204">+94 76 603 6204</a>
                      </div>
                    </div>

                    <div className="contact-sub-link-area">
                      <i class="bi bi-geo-alt-fill"></i>
                      <div className="contact-sub-link w-100">
                        <a href="https://maps.app.goo.gl/Tyv2DQedb96j2Kaj7" target="_blank" rel="noreferrer">No. 182 Central Road, Colombo 12, Sri Lanka</a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-sub-content mb-3">
                    <h6 className="contact-sub-title mb-4">Galle Road, Wellawatta :</h6>
                    <div className="contact-sub-link-area">
                      <i class="bi bi-telephone-fill"></i>
                      <div className="contact-sub-link w-100">
                        <a href="tel:+94775755175">+94 77 575 5175</a>,&nbsp;
                        <a href="tel:+94764408951">+94 76 440 8951</a>
                      </div>
                    </div>

                    <div className="contact-sub-link-area">
                      <i class="bi bi-geo-alt-fill"></i>
                      <div className="contact-sub-link w-100">
                        <a href="https://maps.app.goo.gl/fum1Ge1BbSRmy6H28"
                          target="_blank" rel="noreferrer">No. 296 A1, Galle Road, Wellawatta Sri Lanka</a>
                      </div>
                    </div>

                  </div>

                  <div className="contact-sub-content">
                    <h6 className="contact-sub-title mb-4">K.K.S. Road, Jaffna :
                    </h6>
                    <div className="contact-sub-link-area">
                      <i class="bi bi-telephone-fill"></i>
                      <div className="contact-sub-link w-100">
                        <a href="tel:+94775731318">+94 77 573 1318</a>,&nbsp;
                        <a href="tel:+94764408947">+94 76 440 8947</a>
                      </div>
                    </div>

                    <div className="contact-sub-link-area">
                      <i class="bi bi-geo-alt-fill"></i>
                      <div className="contact-sub-link w-100">
                        <a href="#">No. 183, K.K.S. Road, Jaffna, Sri Lanka</a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* <p className="section-para mt-4" data-aos="fade">
                  Welcome to the future of travel assistance with P.P.T Travels & Tours' advanced ChatBot. Designed to provide you with seamless support, our ChatBot is available 24/7 to help you with all your travel needs. Whether you're checking bookings, confirming vehicle departure times, verifying seat availability, or exploring the luxurious features of our fleet, our ChatBot makes it easy and efficient.
                </p> */}
              </div>
            </div>

            <div className="col-12 col-xl-6 col-lg-7 ps-xl-5">
              <div className="contact-form-container" data-aos="fade-up">
                <h4 className="form-title mb-4">Let's Connect! & Contact</h4>
                <p className="form-desc">
                  We're excited to hear from you! Whether you have a question, need assistance, or want to share your feedback, our team at P.P.T Travels & Tours is here to help. Fill out the form below with your details and message, and we'll get back to you promptly. Your inquiries are our priority, and we're dedicated to providing you with exceptional service
                </p>
                <hr className="text-light" />
                <form action="" className="contact-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="full_name" className="form-label custom-label">Full Name :</label>
                        <input type="text" name="fullName" id="full_name" className="form-control custom-form-input"
                          value={credentials.fullName} onChange={handleInputChange} placeholder="Enter your full name.." required />
                        {/* <span className="error-message">
                          This field is required
                        </span> */}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group mt-4">
                        <label htmlFor="email" className="form-label custom-label">Email :</label>
                        <input type="email" name="email" id="email" className="form-control custom-form-input"
                          value={credentials.email} onChange={handleInputChange} placeholder="Enter your email.." required />
                        {/* <span className="error-message">
                          This field is required
                        </span> */}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group mt-4">
                        <label htmlFor="phone_no" className="form-label custom-label">Phone Number :</label>
                        <input type="number" name="phoneNo" id="phone_no" className="form-control custom-form-input"
                          value={credentials.phoneNo} onChange={handleInputChange} placeholder="Enter your phone number.." min="0" required />
                        {/* <span className="error-message">
                          This field is required
                        </span> */}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group mt-4">
                        <label htmlFor="message" className="form-label custom-label">Message :</label>
                        <textarea id="message" name="message" className="form-control custom-form-input"
                          value={credentials.message} onChange={handleInputChange} placeholder="Enter the message.." required></textarea>
                        {/* <span className="error-message">
                          This field is required
                        </span> */}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-button-area mt-4">
                        <button type="submit" className="btn form-button letter-spaced">
                          SEND
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  */}

      {/* footer section */}
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-content-container">
                <a href="#top" onClick={(e) => handleNavClick(e, 'top')} data-aos="fade-up" className="footer-logo-link">
                  <img src="../logo.png" className="nav-logo" alt="" />
                  <span>P.P.T</span> Travels & Tours
                </a>

                <p className="footer-desc mt-5" data-aos="fade-up">
                  Thank you for visiting P.P.T Travels & Tours. We are dedicated to providing top-tier travel and transport services across Sri Lanka. From luxury bus travel to reliable courier services, air ticketing, and customized transport solutions, our mission is to make your journey seamless and enjoyable.
                </p>

                <p className="footer-desc mb-4" data-aos="fade-up">
                  Stay connected with us through our social media channels for the latest updates and offers. If you have any questions or need assistance, don’t hesitate to reach out through our contact form or customer support. We look forward to serving you and making every trip a memorable one.
                </p>

              </div>
            </div>
          </div>
        </div>
        <div className="sub-footer-area">
          <div className="sub-footer">
            <p>© 2024 P.P.T Travels & Tours. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      {/*  */}

      <button class={`back-to-top d-flex align-items-center justify-content-center ${backToTopActive ? 'active' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i class="bi bi-chevron-double-up back-to-top-icon"></i>
      </button>
    </>
  );
}

export default App;
