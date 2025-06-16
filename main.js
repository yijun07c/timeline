// main.js

function buildTimeline() {
    const main = document.getElementById('main-content');
    
    periods.forEach(period => {
        const section = document.createElement('section');
        section.className = 'period-section';
        section.id = period.id;
        
        const title = document.createElement('div');
        title.className = 'period-title';
        title.innerHTML = `
            <h2>${period.name}</h2>
            <div class="period-intro">${period.intro}</div>
        `;
        
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        
        const periodEvents = events.filter(e => e.period === period.id)
            .sort((a, b) => parseTime(a.time) - parseTime(b.time));
        
        periodEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `event ${getEventPosition(event)}`;
            
            // 简化结构：仅保留圆点、水平线、图片和标题
            eventElement.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="event-group">
                    <div class="timeline-connector">
                        <span class="time-label">${event.time}</span>
                    </div>
                    <div class="event-content">
                        <img src="images/schema-${event.id}.jpg" alt="${event.title}" class="event-image">
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                </div>
            `;
            
            eventElement.querySelector('.event-content').addEventListener('click', () => {
                window.location.href = `details.html?id=${event.id}`;
            });
            
            timeline.appendChild(eventElement);
        });
        
        section.appendChild(title);
        section.appendChild(timeline);
        main.appendChild(section);
    });
    
    addSectionInteractions();
    addAutoScroll();
    setupScrollAnimation();
};



function parseTime(timeStr) {
    const match = timeStr.match(/(-?\d+)/);
    let year = match ? parseInt(match[1]) : 0;
    if (timeStr.includes('万年前')) year *= -10000;
    else if (timeStr.includes('前')) year *= -1;
    return year;
}

function getEventPosition(event) {
    return event.region === '国外' ? 'left' : 'right';
}

function addSectionInteractions() {
    document.querySelectorAll('.period-title').forEach(title => {
        title.addEventListener('click', function() {
            const intro = this.querySelector('.period-intro');
            intro.classList.toggle('show');
            this.classList.toggle('active');
        });
    });
}

function addAutoScroll() {
    let isScrolling = false;
    let scrollInterval;
    
    window.addEventListener('wheel', (e) => {
        if (!isScrolling && e.deltaY > 0) {
            isScrolling = true;
            scrollInterval = setInterval(() => {
                window.scrollBy(0, 2);
            }, 20);
        }
    });
    
    document.addEventListener('click', () => {
        clearInterval(scrollInterval);
        isScrolling = false;
    });
    
    let touchStartY = 0;
    document.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', e => {
        if (touchStartY - e.changedTouches[0].clientY > 50) {
            if (!isScrolling) {
                isScrolling = true;
                scrollInterval = setInterval(() => {
                    window.scrollBy(0, 2);
                }, 20);
            }
        }
    });
}

function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.event').forEach(event => {
        observer.observe(event);
    });
}

document.addEventListener('DOMContentLoaded', buildTimeline);