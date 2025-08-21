---
title: "Towards Private and Fair Machine Learning: Group-Specific Differentially Private Stochastic Gradient Descent with Threshold Optimization"
collection: publications
category: conferences
permalink: /publication/2024-7-23-paper-title-number-2
excerpt: 'Summary: Recent research has highlighted the challenges of integrating differential privacy (DP) with group fairness. One line of work focuses on mitigating accuracy disparities across sensitive groups introduced by DP mechanisms, while another seeks to preserve outcome fairness in DP-trained models. However, these two objectives often conflict, and existing methods typically address them in isolation. To tackle both problems simultaneously, we propose a group-specific DP-SGD training framework combined with classification threshold optimization. Our approach jointly reduces accuracy disparity and achieves outcome fairness.'
date: 2024-7-23
venue: 'The International Conference on Neural Information Processing (ICONIP)'
slidesurl: 'http://ruayz.github.io/files/slide_iconip.pdf'
paperurl: 'http://ruayz.github.io/files/paper_iconip.pdf'
---

Abstract: As machine learning (ML) algorithms become increasingly prevalent in daily life applications, addressing privacy and fairness concerns is imperative and crucial from both ethical and legal perspectives. Establishing private and fair ML models stands as a critical task in cultivating trustworthy ML practices. Recent research has delved into the challenges of merging differential privacy (DP) with group fairness. One aspect focuses on mitigating the amplified accuracy disparity among sensitive groups caused by DP, while another emphasizes maintaining outcome fairness in private models trained by DP methods. However, these dual research objectives often present conflicting demands, with existing methods typically tackling them independently. To bridge this gap, we introduce a novel approach that combines a group-specific DP stochastic gradient descent training mechanism with classification threshold optimization to address these intertwined challenges. Extensive experiments demonstrate the effectiveness of our method in concurrently reducing accuracy parity and demographic parity measurements. Hence, our proposed method can achieve private and fair ML models, which contribute to the development of trustworthy ML. 
