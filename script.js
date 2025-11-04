document.addEventListener('DOMContentLoaded', (event) => {
    
    console.log('Página do Portfólio carregada e pronta!');
    console.log('O arquivo script.js está funcionando.');

    // --- FUTURAS INTERAÇÕES ---
    
    // Exemplo: Animação suave ao clicar nos links de navegação
    // (O CSS 'scroll-behavior: smooth' já faz isso, mas esta é a forma em JS)
    
    /*
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o comportamento padrão do link
            
            const targetId = this.getAttribute('href'); // Pega o href (ex: #projetos)
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Alinha ao topo da seção
                });
            }
        });
    });
    */

    // Exemplo: Efeito "hover" nos cards de projeto (se você quiser fazer via JS)
    /*
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Adiciona uma classe quando o mouse entra
            card.classList.add('card-hovered');
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove a classe quando o mouse sai
            card.classList.remove('card-hovered');
        });
    });
    */

});