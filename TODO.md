# Celestial Mechanics / Spaceflight Cheat Sheet

Concise equations you’ll use most. SI units unless noted.

## Core dynamics

- **Kepler’s 3rd law**
  $$
  T = 2\pi \sqrt{\frac{a^3}{\mu}}
  $$

## Circular & escape speeds

- **Circular speed**

  $$
  v_c=\sqrt{\frac{\mu}{r}}
  $$

- **Escape speed**
  $$
  v_{\text{esc}}=\sqrt{\frac{2\mu}{r}}
  $$

## Orbits & geometry

- **Specific angular momentum**

  $$
  h=\|\mathbf{r}\times\mathbf{v}\|=\sqrt{\mu a(1-e^2)}
  $$

- **Peri/apoapsis radii**

  $$
  r_p=a(1-e),\quad r_a=a(1+e)
  $$

- **Flight-path angle (true anomaly \nu)**

  $$
  \tan\gamma=\frac{e\sin\nu}{1+e\cos\nu}
  $$

- **Kepler’s equation (elliptic)**
  $$
  M=E-e\sin E
  $$

## Transfers & \(\Delta v\)

- **Hohmann transfer (coplanar circular \(r_1 \to r_2\))**

  $$
  a_t=\frac{r_1+r_2}{2}
  $$

  $$
  \Delta v_1=\sqrt{\frac{\mu}{r_1}}\!\left(\sqrt{\frac{2r_2}{r_1+r_2}}-1\right)
  $$

  $$
  \Delta v_2=\sqrt{\frac{\mu}{r_2}}\!\left(1-\sqrt{\frac{2r_1}{r_1+r_2}}\right)
  $$

  $$
  \Delta v_{\text{total}}=\Delta v_1+\Delta v_2,\qquad
  t_t=\pi \sqrt{\frac{a_t^3}{\mu}}
  $$

- **Inclination (plane) change at speed \(v\)**

  $$
  \Delta v=2v\sin\!\left(\frac{\Delta i}{2}\right)
  $$

- **Combine non-collinear burns (vector law)**

  $$
  \Delta v=\sqrt{v_1^2+v_2^2-2v_1 v_2\cos\Delta\theta}
  $$

- **Oberth effect (energy gain near periapsis)**
  $$
  \Delta \varepsilon \approx v\,\Delta v
  $$

## Interplanetary basics

- **Characteristic energy**

  $$
  C_3=v_{\infty}^2
  $$

- **Hyperbolic periapsis speed**

  $$
  v_p=\sqrt{v_{\infty}^2+\frac{2\mu}{r_p}}
  $$

- **Gravity-assist turning angle**

  $$
  \delta=2\arcsin\!\left(\frac{1}{1+\frac{r_p v_{\infty}^2}{\mu}}\right)
  $$

- **Sphere of influence (patched conics)**
  $$
  r_{\text{SOI}}\approx a\left(\frac{m}{M}\right)^{2/5}
  $$

## Rendezvous & proximity ops (circular chief orbit)

- **Clohessy–Wiltshire / Hill’s equations** (radial \(x\), along-track \(y\),
  cross-track \(z\); \(n=\sqrt{\mu/a^3}\))
  $$
  \ddot{x}-2n\dot{y}-3n^2 x=0
  $$
  $$
  \ddot{y}+2n\dot{x}=0
  $$
  $$
  \ddot{z}+n^2 z=0
  $$

## Perturbations (common LEO/MEO approximations)

- **J2 nodal precession (RAAN drift)**

  $$
  \dot{\Omega}\approx-\frac{3}{2}J_2\,n\left(\frac{R_e}{a}\right)^2\frac{\cos i}{(1-e^2)^2}
  $$

- **Argument of perigee rotation**

  $$
  \dot{\omega}\approx\frac{3}{4}J_2\,n\left(\frac{R_e}{a}\right)^2\frac{(5\cos^2 i-1)}{(1-e^2)^2}
  $$

- **Atmospheric drag acceleration**
  $$
  a_D=\frac{1}{2}\,\frac{C_D A}{m}\,\rho\,v^2
  $$

## Launch & propulsion

- **Tsiolkovsky rocket equation**

  $$
  \Delta v=v_e\ln\!\left(\frac{m_0}{m_f}\right)
    =g_0 I_{sp}\ln\!\left(\frac{m_0}{m_f}\right)
  $$

- **Thrust (vacuum, general form)**

  $$
  F=\dot{m}v_e+(p_e-p_a)A_e
  $$

- **Gravity loss (rule-of-thumb)**
  $$
  \Delta v_g \approx \int g\,\sin\gamma \, dt
  $$

## Entry, descent, landing (EDL)

- **Ballistic coefficient**

  $$
  \beta=\frac{m}{C_D A}
  $$

- **Peak convective heating (approx.)**
  $$
  \dot{q}\propto \frac{\sqrt{\rho}\,V^3}{\sqrt{R_n}}
  $$

## Attitude dynamics

- **Euler rotational dynamics**

  $$
  \mathbf{I}\,\dot{\boldsymbol{\omega}}+\boldsymbol{\omega}\times(\mathbf{I}\boldsymbol{\omega})=\mathbf{M}
  $$

- **Quaternion kinematics**
  $$
  \dot{\mathbf{q}}=\tfrac{1}{2}\,\Omega(\boldsymbol{\omega})\,\mathbf{q}
  $$

## Three-body & special tools

- **CR3BP Jacobi integral**

  $$
  C_J=2U-\|\dot{\mathbf{r}}\|^2
  $$

- **Tisserand parameter (w.r.t. planet with semimajor axis \(a_p\))**
  $$
  T=\frac{a_p}{a}+2\sqrt{\frac{a}{a_p}\,(1-e^2)}\cos i
  $$

---

### Quick picks

- **Mission sizing:** Tsiolkovsky, Hohmann \(\Delta v\), plane change
- **Orbit ops:** Vis-viva, Kepler’s eq., CW/Hill
- **Interplanetary:** \(C*3/v*\infty\), gravity-assist \(\delta\), SOI
- **LEO lifetime/groundtrack:** Drag \(a_D\), J2 precession
