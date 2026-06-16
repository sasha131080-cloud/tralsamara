/**
 * ТралСамара — Main Script
 * Навигация, калькулятор, форма, маска телефона, фильтр каталога
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================
    // Мобильное меню
    // ============================
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    if (burger && nav) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Закрыть меню при клике на ссылку
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // ============================
    // Маска телефона
    // ============================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (!value.startsWith('7') && !value.startsWith('8')) {
                value = '7' + value;
            }
            if (value.startsWith('8')) {
                value = '7' + value.substring(1);
            }
            
            let formatted = '+7 ';
            if (value.length > 1) {
                formatted += '(' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(9, 11);
            }
            
            this.value = formatted;
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length <= 4) {
                this.value = '';
            }
        });
    });

    // ============================
    // Калькулятор быстрого расчёта
    // ============================
    const calcBtn = document.getElementById('calcBtn');
    const calcResult = document.getElementById('calcResult');
    const calcPrice = document.getElementById('calcPrice');
    const calcOrderBtn = document.getElementById('calcOrderBtn');
    
    // Базовые ставки (руб/час) - демо-значения
    const rates = {
        excavator: 3500,
        bulldozer: 4000,
        dumper: 2500,
        crane: 4500,
        trawl: 5000,
        loader: 3000
    };
    
    if (calcBtn) {
        calcBtn.addEventListener('click', function() {
            const type = document.getElementById('calcType').value;
            const hours = parseInt(document.getElementById('calcHours').value) || 8;
            const days = parseInt(document.getElementById('calcDays').value) || 1;
            
            if (!type) {
                calcResult.style.display = 'block';
                calcPrice.textContent = 'Выберите тип техники';
                calcPrice.style.fontSize = '16px';
                calcOrderBtn.style.display = 'none';
                return;
            }
            
            const rate = rates[type] || 3000;
            const total = rate * hours * days;
            
            calcPrice.style.fontSize = '28px';
            calcPrice.textContent = total.toLocaleString('ru-RU') + ' ₽';
            calcResult.style.display = 'block';
            calcOrderBtn.style.display = 'inline-flex';
            
            calcOrderBtn.onclick = function() {
                document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
                const serviceSelect = document.getElementById('orderService');
                if (serviceSelect) {
                    // Map calc type to service select option
                    const mapping = {
                        excavator: 'Экскаватор',
                        bulldozer: 'Бульдозер',
                        dumper: 'Самосвал',
                        crane: 'Автокран',
                        trawl: 'Трал',
                        loader: 'Погрузчик'
                    };
                    const options = serviceSelect.options;
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].value === mapping[type]) {
                            serviceSelect.value = mapping[type];
                            break;
                        }
                    }
                }
            };
        });
        
        // Enter в полях калькулятора
        document.querySelectorAll('#calcForm input').forEach(inp => {
            inp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    calcBtn.click();
                }
            });
        });
    }

    // ============================
    // Фильтр каталога
    // ============================
    const filterBtns = document.querySelectorAll('.catalog-filter__btn');
    const catalogItems = document.querySelectorAll('.product-card');
    
    if (filterBtns.length && catalogItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('catalog-filter__btn--active'));
                this.classList.add('catalog-filter__btn--active');
                
                const filter = this.dataset.filter;
                
                catalogItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============================
    // Отправка формы
    // ============================
    const forms = document.querySelectorAll('#orderForm, #callbackFormInner');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация
            const phoneField = this.querySelector('input[type="tel"]');
            if (phoneField) {
                const phone = phoneField.value.replace(/\D/g, '');
                if (phone.length < 10) {
                    alert('Пожалуйста, введите корректный номер телефона');
                    phoneField.focus();
                    return;
                }
            }
            
            const consentField = this.querySelector('input[name="consent"]');
            if (consentField && !consentField.checked) {
                alert('Необходимо согласие на обработку персональных данных');
                consentField.focus();
                return;
            }
            
            // Собираем данные
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });
            
            // Показываем успех
            const orderCard = this.closest('.order__card');
            if (orderCard) {
                const successDiv = orderCard.querySelector('.order__success');
                if (successDiv) {
                    this.style.display = 'none';
                    successDiv.style.display = 'block';
                    return;
                }
            }
            
            // Для виджета обратного звонка
            const widgetForm = this.closest('.callback-widget__form');
            if (widgetForm) {
                const successDiv = widgetForm.querySelector('.callback-widget__success');
                const formInner = widgetForm.querySelector('form');
                if (successDiv && formInner) {
                    formInner.style.display = 'none';
                    successDiv.style.display = 'block';
                    setTimeout(() => {
                        widgetForm.classList.remove('active');
                        setTimeout(() => {
                            formInner.style.display = '';
                            successDiv.style.display = 'none';
                        }, 300);
                    }, 3000);
                    return;
                }
            }
            
            // Fallback: просто алерт
            alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    });

    // ============================
    // Виджет обратного звонка
    // ============================
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackForm = document.getElementById('callbackForm');
    
    if (callbackBtn && callbackForm) {
        callbackBtn.addEventListener('click', function() {
            callbackForm.classList.toggle('active');
        });
        
        // Закрыть при клике вне виджета
        document.addEventListener('click', function(e) {
            const widget = document.getElementById('callbackWidget');
            if (widget && !widget.contains(e.target)) {
                callbackForm.classList.remove('active');
            }
        });
    }

    // ============================
    // Плавный скролл к якорям
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            
            if (targetId === '' || targetId === '!') return;
            
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================
    // Header scroll effect
    // ============================
    const header = document.getElementById('header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ============================
    // Анимация чисел (Intersection Observer)
    // ============================
    const animateNumbers = function() {
        const numbers = document.querySelectorAll('.about__number, .hero__stat-num');
        
        numbers.forEach(num => {
            const text = num.textContent;
            const value = parseInt(text.replace(/[^0-9]/g, ''));
            if (isNaN(value)) return;
            
            const suffix = text.replace(/[0-9]/g, '');
            let start = 0;
            const duration = 1500;
            const step = Math.ceil(value / 30);
            
            const update = () => {
                start += step;
                if (start >= value) {
                    num.textContent = text;
                    return;
                }
                num.textContent = start + suffix;
                requestAnimationFrame(update);
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        update();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(num);
        });
    };
    
    // Активируем анимацию чисел
    animateNumbers();

    // Устанавливаем минимальную дату для input date = сегодня
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });

});
