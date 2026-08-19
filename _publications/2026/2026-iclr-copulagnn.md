---
title:          "A Scalable Inter-edge Correlation Modeling in CopulaGNN for Link Sign Prediction"
date:           2026-01-21 00:01:00 +0900
selected:       true
pub:            "International Conference on Learning Representations (ICLR)"
pub_date:       "2026"
type:           "Conference"
abstract: >-
  Link sign prediction on a signed graph is a task to determine whether the relationship represented by an edge is positive or negative. Since the presence of negative edges violates the graph homophily assumption that adjacent nodes are similar, regular graph methods have not been applicable without auxiliary structures to handle them. We aim to directly model the latent statistical dependency among edges with the Gaussian copula and its corresponding correlation matrix, extending CopulaGNN (Ma et al., 2021). However, a naive modeling of edge-edge relations is computationally intractable even for a graph with moderate scale. To address this, we propose to 1) represent the correlation matrix as a Gramian of edge embeddings, significantly reducing the number of parameters, and 2) reformulate the conditional probability distribution to dramatically reduce the inference cost. We theoretically verify scalability of our method by proving its linear convergence. Also, our extensive experiments demonstrate that it achieves significantly faster convergence than baselines, maintaining competitive prediction performance to the state-of-the-art models.
authors:
  - Jinkyu Sung
  - Myunggeum Jee
  - Joonseok Lee
links:
  Paper: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f6712d5191d2501dfc7024389f7bfcdd-Abstract-Conference.html
  GitHub: https://github.com/jinkyusung/CopulaLSP
---
